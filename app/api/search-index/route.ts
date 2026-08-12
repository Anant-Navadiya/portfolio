import { connection } from "next/server";

import { getSearchIndex } from "@/lib/search-index";

export const GET = async () => {
    await connection();
    return Response.json(await getSearchIndex());
};
