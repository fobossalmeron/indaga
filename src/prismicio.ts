import * as prismic from "@prismicio/client";
import * as prismicNext from "@prismicio/next";
import config from "../slicemachine.config.json";

export const repositoryName = config.repositoryName

/**
 * @param config - Configuration for the Prismic client.
 */
/**
 * Configuración para el cliente de Prismic sin caché.
 */
const clientConfig: prismic.ClientConfig = {
  fetchOptions: {
    cache: "no-store",
    next: { revalidate: 0 }
  }
};

/**
 * @param config - Configuración para el cliente de Prismic.
 */
export function createClient(config: prismicNext.CreateClientConfig = {}) {
  return prismic.createClient(repositoryName, {
    ...clientConfig,
    ...config,
  });
}