import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { CharacterTextSplitter } from "langchain/text_splitter";
import { OpenAI } from "langchain/llms/openai";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { loadQAMapReduceChain } from "langchain/chains";

export default async function Home() {
  const loader = new PDFLoader("data/pg.pdf", {
    splitPages: false,
  });
  const res_pdf = await loader.load();
  const str = res_pdf[0].pageContent.replace(/\n/g, " ").replace(/,/g, "");
  const splitter = new CharacterTextSplitter({
    separator: " ",
    chunkSize: 512,
    chunkOverlap: 24,
  });
  const output = await splitter.createDocuments([str]);
  const model = new OpenAI({
    openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  });
  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  });
  const store = await MemoryVectorStore.fromDocuments(output, embeddings);
  const question = "What is the name of your company?"; //会社名は何ですか？
  const relevantDocs = await store.similaritySearch(question);
  const chain = loadQAMapReduceChain(model);
  const res = await chain.call({
    input_documents: relevantDocs,
    question,
  });
  return (
    <main>
      <h1 className="text-center text-3xl">langchain</h1>
      <p className="text-center pt-2">{res.text}</p>
    </main>
  );
}
