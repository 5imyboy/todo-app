export default function Home() {
  return (
    <div className="grid grid-rows-8 font-sans items-center justify-items-center min-h-screen p-8 pb-20 gap-4 sm:p-10">
      <h1 className="row-span-1 text-4xl text-center p-4">
        Todo List
      </h1>
      <main className="row-span-6 h-full w-8/10 grid grid-cols-3 flex flex-row gap-[32px] items-center text-center text-xl rounded">
        <div className="bg-sky-400 h-full col-span-1 rounded-2xl">
          <h2 className="p-2">Not Started</h2>
        </div>
        <div className="bg-sky-300 h-full col-span-1 rounded-2xl">
          <h2 className="p-2">In Progress</h2>
        </div>
        <div className="bg-sky-200 h-full col-span-1 rounded-2xl">
          <h2 className="p-2">Completed</h2>
        </div>
      </main>
      <footer className="row-span-1 gap-[24px] flex flex-wrap items-center justify-center p-4">
        <h2>Footer</h2>
      </footer>
    </div>
  );
}
