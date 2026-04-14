import VideoTemplate from "@/components/video/VideoTemplate";
import { SyncEditor } from "@/components/video/SyncEditor";

const isEditor = new URLSearchParams(window.location.search).has('editor');

export default function App() {
  if (isEditor) return <SyncEditor />;
  return <VideoTemplate />;
}
