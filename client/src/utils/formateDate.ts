export const formatDate = (date: string | Date): string => {
    const d = date instanceof Date ? date : new Date(date);

    if (isNaN(d.getTime())) return "";

    return d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
};
