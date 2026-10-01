import { jest } from "@jest/globals";
import client from "../../api/axiosClient";
import type { Comment, PaginatedDocs } from "../../api/types";
import { render, screen, userEvent, waitFor } from "../../test/test-utils";
import CommentSection from "./CommentSection";

const me = {
  _id: "u1",
  username: "alice",
  email: "alice@example.com",
  fullName: "Alice",
  avatar: { url: "", publicId: "" },
  createdAt: "",
  updatedAt: "",
};

const makeComment = (overrides: Partial<Comment> = {}): Comment => ({
  _id: "c1",
  content: "Great video",
  owner: { _id: "u2", username: "bob", fullName: "Bob" },
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  likeCount: 2,
  isLikedByMe: false,
  ...overrides,
});

// Shape of the server's ApiResponse wrapping an aggregatePaginate result
const commentsResponse = (docs: Comment[]) => ({
  data: {
    data: {
      docs,
      totalDocs: docs.length,
      page: 1,
      totalPages: 1,
      hasNextPage: false,
      nextPage: null,
    } satisfies PaginatedDocs<Comment>,
  },
});

describe("CommentSection", () => {
  let getSpy: jest.SpiedFunction<typeof client.get>;
  let postSpy: jest.SpiedFunction<typeof client.post>;

  beforeEach(() => {
    getSpy = jest.spyOn(client, "get");
    postSpy = jest.spyOn(client, "post");
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("shows comments and a login prompt for guests", async () => {
    getSpy.mockResolvedValue(commentsResponse([makeComment()]));

    render(<CommentSection videoId="v1" />, { preloadedState: { user: null } });

    expect(await screen.findByText("Great video")).toBeInTheDocument();
    expect(screen.getByText("1 comment")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Log in" })).toBeInTheDocument();
    expect(screen.queryByLabelText("Add a comment")).not.toBeInTheDocument();
    expect(getSpy).toHaveBeenCalledWith("/comments/v1", { params: { page: 1, limit: 10 } });
  });

  it("posts a trimmed comment and clears the input", async () => {
    getSpy.mockResolvedValue(commentsResponse([]));
    postSpy.mockResolvedValue({ data: { data: makeComment({ _id: "c2", content: "Hello" }) } });

    render(<CommentSection videoId="v1" />, { preloadedState: { user: me } });

    const input = await screen.findByLabelText("Add a comment");
    await userEvent.type(input, "  Hello  ");
    await userEvent.click(screen.getByRole("button", { name: "Comment" }));

    await waitFor(() => expect(postSpy).toHaveBeenCalledWith("/comments/v1", { content: "Hello" }));
    await waitFor(() => expect(input).toHaveValue(""));
  });

  it("only lets the owner delete, and likes optimistically", async () => {
    getSpy.mockResolvedValue(
      commentsResponse([
        makeComment(),
        makeComment({ _id: "c3", content: "Mine", owner: { _id: "u1", username: "alice" } }),
      ])
    );
    postSpy.mockReturnValue(new Promise(() => {})); // keep the like request pending

    render(<CommentSection videoId="v1" />, { preloadedState: { user: me } });

    await screen.findByText("Mine");
    expect(screen.getAllByRole("button", { name: "Delete comment" })).toHaveLength(1);

    const [likeBob] = screen.getAllByRole("button", { name: "Like comment" });
    await userEvent.click(likeBob);

    expect(postSpy).toHaveBeenCalledWith("/likes/toggle/c/c1");
    expect(await screen.findByRole("button", { name: "Unlike comment" })).toHaveTextContent("3");
  });
});
