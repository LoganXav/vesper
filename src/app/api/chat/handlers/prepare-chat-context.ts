import {
  buildStructuredContext,
  parseMarkdownToChunks,
} from "@/utils/markdown-utils";

export const prepareChatContextHandler = ({
  documentContent,
}: {
  documentContent: string;
}) => {
  try {
    const parseDocumentContentToChunks = parseMarkdownToChunks(documentContent);

    // Build structured LLM context
    const structuredContext = buildStructuredContext(
      parseDocumentContentToChunks,
    );

    // Provide IDs for the LLM to reference in its edit instructions
    const allChunkIds = parseDocumentContentToChunks
      .map((c) => c.id)
      .join(", ");

    return {
      structuredContext,
      allChunkIds,
    };
  } catch (error) {
    throw error;
  }
};
