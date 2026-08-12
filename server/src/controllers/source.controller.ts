import type { Request, Response } from "express";
import { ValidationError } from "../types/app-error.js";
import {
  createSourceSchema,
  listSourcesQuerySchema,
  sourceIdParamSchema,
  workspaceIdParamSchema,
} from "../validators/source.validator.js";
import { getZodFieldErrors } from "../utils/zod-error.js";
import {
  createTextOrMarkdownSource,
  listSourcesForWorkspace,
} from "../services/source.services.js";

function parseWorkspaceId(params: Request["params"]) {
  const parsed = workspaceIdParamSchema.safeParse(params);

  if (!parsed.success) {
    throw new ValidationError(
      "Invalid workspace id",
      getZodFieldErrors(parsed.error),
    );
  }

  return parsed.data;
}

function parseSourceParams(params: Request["params"]) {
  const parsed = sourceIdParamSchema.safeParse(params);

  if (!parsed.success) {
    throw new ValidationError(
      "Invalid source id",
      getZodFieldErrors(parsed.error),
    );
  }

  return parsed.data;
}

function parseListQuery(query: Request["query"]) {
  const parsed = listSourcesQuerySchema.safeParse(query);

  if (!parsed.success) {
    throw new ValidationError(
      "Invalid query parameters",
      getZodFieldErrors(parsed.error),
    );
  }

  return parsed.data;
}

function parseCreateBody(body: unknown) {
  const parsed = createSourceSchema.safeParse(body);

  if (!parsed.success) {
    throw new ValidationError(
      "Validation failed",
      getZodFieldErrors(parsed.error),
    );
  }

  return parsed.data;
}

export async function listSources(req: Request, res: Response) {
  const { workspaceId } = parseWorkspaceId(req.params);
  const filters = parseListQuery(req.query);
  const userId = req.session?.user?.id;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const sources = await listSourcesForWorkspace(workspaceId, userId, filters);

  res.json(sources);
}

// export async function createSource(req: Request, res: Response) {
//   const { workspaceId } = parseWorkspaceId(req.params);
//   const input = parseCreateBody(req.body);
//   const source = await createTextOrMarkdownSource(
//     workspaceId,
//     req.session.user.id,
//     input,
//   );
//   res.status(201).json(source);
// }

export async function createSource(req: Request, res: Response) {
  const { workspaceId } = parseWorkspaceId(req.params);
  const input = parseCreateBody(req.body);

  const userId = req.session?.user?.id;
  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const source = await createTextOrMarkdownSource(workspaceId, userId, input);
  res.status(201).json(source);
}
