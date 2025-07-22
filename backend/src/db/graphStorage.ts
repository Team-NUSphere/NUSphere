import { sendSwapCycleMessage } from "#telegramBot.js";
import { Sequelize } from "sequelize";
import { Op } from "sequelize";

import { sequelize } from "./index.js";
import MatchedRequest from "./models/MatchedRequest.js";
import SwapCycle from "./models/SwapCycle.js";
import SwapRequests from "./models/SwapRequests.js";

type AdjacencyMap = Map<string, SwapRequests[]>;
type LessonGraph = Map<string, AdjacencyMap>;
type ModuleGraph = Map<string, LessonGraph>;

export class SwapGraphManager {
  private graph: ModuleGraph = new Map();

  addEdge(request: SwapRequests) {
    const { fromClassNo, lessonType, moduleCode } = request;

    let moduleGraph = this.graph.get(moduleCode);
    if (!moduleGraph) {
      moduleGraph = new Map();
      this.graph.set(moduleCode, moduleGraph);
    }

    let lessonGraph = moduleGraph.get(lessonType);
    if (!lessonGraph) {
      lessonGraph = new Map();
      moduleGraph.set(lessonType, lessonGraph);
    }

    let fromList = lessonGraph.get(fromClassNo);
    if (!fromList) {
      fromList = [];
      lessonGraph.set(fromClassNo, fromList);
    }

    const cycle = this.findCycle(request, 5);
    if (cycle) {
      return cycle;
    } else {
      fromList.push(request);
      return null;
    }
  }

  addEdgeWithoutChecking(request: SwapRequests) {
    const { fromClassNo, lessonType, moduleCode } = request;

    let moduleGraph = this.graph.get(moduleCode);
    if (!moduleGraph) {
      moduleGraph = new Map();
      this.graph.set(moduleCode, moduleGraph);
    }

    let lessonGraph = moduleGraph.get(lessonType);
    if (!lessonGraph) {
      lessonGraph = new Map();
      moduleGraph.set(lessonType, lessonGraph);
    }

    let fromList = lessonGraph.get(fromClassNo);
    if (!fromList) {
      fromList = [];
      lessonGraph.set(fromClassNo, fromList);
    }
    fromList.push(request);
  }

  async cancelRequest(request: string | SwapRequests): Promise<void> {
    const transaction = await sequelize.transaction();

    try {
      // Resolve the request object
      const req =
        typeof request === "string"
          ? await SwapRequests.findByPk(request, {
              include: [
                {
                  as: "Match",
                  include: [{ as: "Cycle", model: SwapCycle }],
                  model: MatchedRequest,
                },
              ],
              transaction,
            })
          : request;

      if (!req) {
        throw new Error(
          `Swap request ${typeof request === "string" ? request : request.id} not found`,
        );
      }

      // Update request status to "cancelled"
      await req.update({ status: "cancelled" }, { transaction });

      // Remove the request from the graph
      this.removeEdgeFromGraph(req);

      // If no associated cycle, we're done
      const cycle = req.Match?.Cycle;
      const cycleId = cycle?.id;
      if (!cycle || !cycleId) {
        await transaction.commit();
        return;
      }

      // Fetch other requests in the same cycle
      const matchedRequests = await MatchedRequest.findAll({
        include: [{ as: "Request", model: SwapRequests }],
        transaction,
        where: { cycleId, [Op.not]: { requestId: req.id } },
      });

      const requests = matchedRequests
        .map((r) => r.Request)
        .filter((r): r is SwapRequests => !!r);

      await Promise.all(
        matchedRequests.map((match) => match.destroy({ transaction })),
      );
      await req.Match?.destroy();
      await cycle.destroy({ transaction });

      // Attempt to find new cycles for remaining requests
      for (const otherRequest of requests) {
        const path = this.addEdge(otherRequest);
        if (path) {
          // Remove the path from the graph to avoid duplicates
          for (const r of path) {
            this.removeEdgeFromGraph(r);
          }
          // Create a new swap cycle
          const cycle = await createSwapCycleFromPath(sequelize, path);
          await sendSwapCycleMessage(
            cycle,
            otherRequest.moduleCode,
            otherRequest.lessonType,
          );
        }
      }
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  clearGraph(): void {
    this.graph.clear();
  }

  findCycle(originalRequest: SwapRequests, maxDepth = 5) {
    const moduleGraph = this.graph.get(originalRequest.moduleCode);
    if (!moduleGraph) return null;

    const lessonGraph = moduleGraph.get(originalRequest.lessonType);
    if (!lessonGraph) return null;

    const fromClassNo = originalRequest.fromClassNo;
    const visited = new Set<string>();
    const path: SwapRequests[] = [];

    const dfs = (current: string, depth: number): boolean => {
      if (depth > maxDepth) return false;
      if (current === fromClassNo && path.length > 0) {
        return true;
      }
      const requests = lessonGraph.get(current);
      if (!requests) return false;

      for (const request of requests) {
        path.push(request);
        for (const toClassNo of request.toClassNos) {
          if (visited.has(toClassNo) && toClassNo !== fromClassNo) continue;

          visited.add(toClassNo);

          if (dfs(toClassNo, depth + 1)) {
            // Remove the edge that led down this successful path from the graph
            lessonGraph.set(
              current,
              requests.filter((req) => req.id !== request.id),
            );
            return true;
          }
          visited.delete(toClassNo);
        }
        path.pop();
      }

      return false;
    };

    visited.add(fromClassNo);
    path.push(originalRequest);

    for (const toClassNo of originalRequest.toClassNos) {
      visited.add(toClassNo);
      if (dfs(toClassNo, 1)) {
        return path;
      }
      visited.delete(toClassNo);
    }
    return null;
  }

  async fulfillSwap(requestId: string): Promise<void> {
    // Use a transaction to ensure atomicity
    const transaction = await sequelize.transaction();

    try {
      // Fetch the request with its associated match and cycle
      const request = await SwapRequests.findByPk(requestId, {
        include: [
          {
            as: "Match",
            include: [{ as: "Cycle", model: SwapCycle }],
            model: MatchedRequest,
          },
        ],
        transaction,
      });

      if (!request) {
        throw new Error(`Swap request with ID ${requestId} not found`);
      }

      if (!request.Match?.Cycle?.id) {
        throw new Error(
          `No associated cycle found for request ID ${requestId}`,
        );
      }

      // Update the request status to "fulfilled"
      await request.update({ status: "fulfilled" }, { transaction });

      // Fetch the cycle with all associated requests
      const cycle = await SwapCycle.findByPk(request.Match.Cycle.id, {
        include: [
          {
            as: "Requests",
            include: [{ as: "Request", model: SwapRequests }],
            model: MatchedRequest,
          },
        ],
        transaction,
      });

      if (!cycle) {
        throw new Error(`Cycle with ID ${request.Match.Cycle.id} not found`);
      }

      // Check if all requests in the cycle are fulfilled
      const allRequestsFulfilled = cycle.Requests?.every(
        (match) => match.Request?.status === "fulfilled",
      );

      if (allRequestsFulfilled) {
        await cycle.update({ status: "confirmed" }, { transaction });
      }

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  getGraph(): ModuleGraph {
    return this.graph;
  }

  async loadGraphFromDb(): Promise<void> {
    this.clearGraph();

    const requests = await SwapRequests.findAll({
      include: [
        {
          as: "Match",
          model: MatchedRequest,
          required: false,
        },
      ],
      where: {
        "$Match.id$": null,
        status: "pending",
      },
    });
    for (const request of requests) {
      this.addEdgeWithoutChecking(request);
    }

    console.log("graph loaded from db");
  }

  removeEdgeFromGraph(request: SwapRequests) {
    const moduleGraph = this.graph.get(request.moduleCode);
    if (!moduleGraph) return;

    const lessonGraph = moduleGraph.get(request.lessonType);
    if (!lessonGraph) return;

    const fromList = lessonGraph.get(request.fromClassNo);
    if (!fromList) return;

    const filtered = fromList.filter((edge) => edge.id !== request.id);

    if (filtered.length === 0) {
      lessonGraph.delete(request.fromClassNo);
    } else {
      lessonGraph.set(request.fromClassNo, filtered);
    }

    if (lessonGraph.size === 0) {
      moduleGraph.delete(request.lessonType);
    }

    if (moduleGraph.size === 0) {
      this.graph.delete(request.moduleCode);
    }
  }

  async submitSwapRequest(
    moduleCode: string,
    lessonType: string,
    fromClassNo: string,
    toClassNos: string[],
    uid: string,
  ): Promise<null | { cycleCreated: boolean; request: SwapRequests }> {
    // Validate inputs
    if (
      !moduleCode ||
      !lessonType ||
      !fromClassNo ||
      !toClassNos.length ||
      !uid
    ) {
      throw new Error(
        "Invalid input: moduleCode, lessonType, fromClassNo, toClassNos, and uid are required",
      );
    }
    console.log(this.graph);
    const transaction = await sequelize.transaction();

    try {
      // Prevent duplicate requests
      const [request, created] = await SwapRequests.findOrCreate({
        attributes: [
          "id",
          "moduleCode",
          "lessonType",
          "fromClassNo",
          "toClassNos",
          "uid",
          "status",
        ], // Optimize fields
        defaults: {
          fromClassNo,
          lessonType,
          moduleCode,
          status: "pending",
          toClassNos,
          uid,
        },
        transaction,
        where: {
          lessonType,
          moduleCode,
          status: "pending",
          uid,
        },
      });
      // Duplicate request found
      if (!created) {
        await transaction.commit();
        return null;
      }

      // Add the request to the graph and check for a cycle
      let path: null | SwapRequests[];
      try {
        path = this.addEdge(request);
      } catch (error) {
        console.warn(`Failed to add request ${request.id} to graph:`, error);
        await transaction.commit();
        return { cycleCreated: false, request };
      }

      if (!path) {
        await transaction.commit();
        return { cycleCreated: false, request };
      }

      // Remove the cycle’s requests from the graph so each request only get a match at a time
      for (const req of path) {
        this.removeEdgeFromGraph(req);
      }
      await transaction.commit();

      const cycle = await createSwapCycleFromPath(sequelize, path);
      await sendSwapCycleMessage(cycle, moduleCode, lessonType);

      return { cycleCreated: true, request };
    } catch (error) {
      await transaction.rollback();
      if (error instanceof Error)
        throw new Error(`Failed to submit swap request: ${error.message}`);
      else throw new Error("Encountered error inserting swap request");
    }
  }
}

async function createSwapCycleFromPath(
  sequelize: Sequelize,
  path: SwapRequests[],
): Promise<SwapCycle> {
  const transaction = await sequelize.transaction();

  try {
    // Validate the cycle
    for (let i = 0; i < path.length; i++) {
      const currentRequest = path[i];
      const nextRequest = path[(i + 1) % path.length]; // Wrap around as cycle
      if (!currentRequest.toClassNos.includes(nextRequest.fromClassNo)) {
        throw new Error(
          `Invalid cycle: Request ${currentRequest.id} cannot connect to ${nextRequest.id}`,
        );
      }
    }

    const swapCycle = await SwapCycle.create(
      {
        status: "pending",
      },
      { transaction },
    );

    // Create MatchedRequest entries
    await Promise.all(
      path.map(async (request, index) => {
        // Next Request from is Current Request to
        const nextRequest = path[(index + 1) % path.length];
        return MatchedRequest.create(
          {
            cycleId: swapCycle.id,
            fromClassNo: request.fromClassNo,
            position: index,
            requestId: request.id,
            toClassNo: nextRequest.fromClassNo,
          },
          { transaction },
        );
      }),
    );

    await transaction.commit();

    // Fetch the SwapCycle with associated MatchedRequests
    const createdCycle = await SwapCycle.findByPk(swapCycle.id, {
      include: [{ as: "Requests", model: MatchedRequest }],
    });

    if (!createdCycle) {
      throw new Error("Failed to fetch created SwapCycle");
    }

    return createdCycle;
  } catch (error) {
    // Roll back the transaction on error

    await transaction.rollback();

    throw error;
  }
}
