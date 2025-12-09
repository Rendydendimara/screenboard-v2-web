import React from "react";

const DummyView: React.FC = () => {
  // Create array for cards (10 cards as shown in the image)
  const cards = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <div className="w-full flex flex-col gap-12">
      {/* Dashboard Section 1 */}
      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-semibold text-slate-900">Dashboard</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {cards.slice(0, 10).map((card) => (
            <div
              key={card}
              className="flex flex-col gap-2 bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="aspect-[4/3] w-full overflow-hidden">
                <img
                  src="/src/assets/images/dummy-component.png"
                  alt="Figma Configuration Screen"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="px-3 pb-3">
                <p className="text-sm text-slate-600">
                  Figma Configuration Screen
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dashboard Section 2 */}
      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-semibold text-slate-900">Dashboard</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {cards.slice(0, 4).map((card) => (
            <div
              key={`section2-${card}`}
              className="flex flex-col gap-2 bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="aspect-[4/3] w-full overflow-hidden">
                <img
                  src="/src/assets/images/dummy-component.png"
                  alt="Figma Configuration Screen"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="px-3 pb-3">
                <p className="text-sm text-slate-600">
                  Figma Configuration Screen
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dashboard Section 3 */}
      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-semibold text-slate-900">Dashboard</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {cards.slice(0, 4).map((card) => (
            <div
              key={`section3-${card}`}
              className="flex flex-col gap-2 bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="aspect-[4/3] w-full overflow-hidden">
                <img
                  src="/src/assets/images/dummy-component.png"
                  alt="Figma Configuration Screen"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="px-3 pb-3">
                <p className="text-sm text-slate-600">
                  Figma Configuration Screen
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DummyView;
