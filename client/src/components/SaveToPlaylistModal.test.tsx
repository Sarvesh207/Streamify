import { jest } from "@jest/globals";
import client from "../api/axiosClient";
import type { Playlist } from "../api/types";
import { render, screen, userEvent, waitFor } from "../test/test-utils";
import SaveToPlaylistModal from "./SaveToPlaylistModal";

const me = {
  _id: "u1",
  username: "alice",
  email: "alice@example.com",
  fullName: "Alice",
  avatar: { url: "", publicId: "" },
  createdAt: "",
  updatedAt: "",
};

const makePlaylist = (overrides: Partial<Playlist> = {}): Playlist => ({
  _id: "p1",
  name: "Favourites",
  videos: [],
  owner: "u1",
  createdAt: "",
  updatedAt: "",
  ...overrides,
});

describe("SaveToPlaylistModal", () => {
  let getSpy: jest.SpiedFunction<typeof client.get>;
  let patchSpy: jest.SpiedFunction<typeof client.patch>;
  let postSpy: jest.SpiedFunction<typeof client.post>;

  beforeEach(() => {
    getSpy = jest.spyOn(client, "get");
    patchSpy = jest.spyOn(client, "patch").mockResolvedValue({ data: { data: {} } });
    postSpy = jest.spyOn(client, "post");
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const renderModal = () =>
    render(<SaveToPlaylistModal isOpen onClose={() => {}} videoId="v1" />, {
      preloadedState: { user: me },
    });

  it("checks playlists that already contain the video", async () => {
    getSpy.mockResolvedValue({
      data: { data: [makePlaylist(), makePlaylist({ _id: "p2", name: "Watch later", videos: ["v1"] })] },
    });

    renderModal();

    expect(await screen.findByRole("checkbox", { name: "Watch later", hidden: true })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "Favourites", hidden: true })).not.toBeChecked();
    expect(getSpy).toHaveBeenCalledWith("/playlist/user/u1");
  });

  it("adds and removes the video when toggled", async () => {
    getSpy.mockResolvedValue({
      data: { data: [makePlaylist(), makePlaylist({ _id: "p2", name: "Watch later", videos: ["v1"] })] },
    });

    renderModal();

    await userEvent.click(await screen.findByText("Favourites"));
    await waitFor(() => expect(patchSpy).toHaveBeenCalledWith("/playlist/add/v1/p1"));

    await userEvent.click(screen.getByText("Watch later"));
    await waitFor(() => expect(patchSpy).toHaveBeenCalledWith("/playlist/remove/v1/p2"));
  });

  it("creates a playlist and saves the video into it", async () => {
    getSpy.mockResolvedValue({ data: { data: [] } });
    postSpy.mockResolvedValue({ data: { data: makePlaylist({ _id: "p9", name: "New one" }) } });

    renderModal();

    expect(await screen.findByText("You don't have any playlists yet.")).toBeInTheDocument();
    await userEvent.type(screen.getByLabelText("Name"), "New one");
    await userEvent.click(screen.getByRole("button", { name: "Create new playlist" }));

    await waitFor(() => expect(postSpy).toHaveBeenCalledWith("/playlist", { name: "New one" }));
    await waitFor(() => expect(patchSpy).toHaveBeenCalledWith("/playlist/add/v1/p9"));
  });
});
