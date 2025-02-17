export default function FullScreenLoading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/80">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
    </div>
  );
}
