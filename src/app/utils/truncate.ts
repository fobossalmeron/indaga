export const truncate = (input: string) =>
    input?.length > 40 ? `${input.substring(0, 43)}...` : input;