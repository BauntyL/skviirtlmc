export default function Map() {
  return (
    <div className="flex-1 w-full bg-background relative overflow-hidden min-h-[calc(100vh-80px)]">
      {/* Map Container */}
      <div className="absolute inset-0 w-full h-full flex flex-col">
        <div className="flex-1 w-full h-full relative">
          <iframe 
            src="http://213.152.43.45:25979/" 
            className="absolute inset-0 w-full h-full border-none"
            title="Minecraft Dynamic Map"
            allowFullScreen
            loading="lazy"
          />
          
          {/* Overlay to catch clicks if needed or just for styling */}
          <div className="absolute top-4 left-4 z-10 pointer-events-none">
            <div className="bg-background/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl shadow-2xl">
              <h1 className="text-sm font-display font-bold text-white flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Живая карта сервера
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
