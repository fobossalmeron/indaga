import * as prismic from "@prismicio/client";
import * as prismicNext from "@prismicio/next";
import config from "../slicemachine.config.json";

export const repositoryName = config.repositoryName

/**
 * @param config - Configuration for the Prismic client.
 */

export function createClient(config: prismicNext.CreateClientConfig = {}) {
  return prismic.createClient(repositoryName, {
    ...config,
  });
}
