"use client";

import { createEdgeStoreProvider } from "@edgestore/react";
import type { EdgeStoreRouter } from "./edgestore";

export const { EdgeStoreProvider, useEdgeStore } =
  createEdgeStoreProvider<EdgeStoreRouter>();
