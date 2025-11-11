interface TabSelectorProps {
  tabs: string[];
  activeTab: number;
  onTabChange: (index: number) => void;
}

export default function TabSelector({ tabs, activeTab, onTabChange }: TabSelectorProps) {
  return (
    <div className="flex justify-center mb-12">
      <div className="bg-[#CFEBE9]/50 backdrop-blur border border-[#006D68] rounded-full p-1 flex">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => onTabChange(index)}
            className={`px-8 py-3 rounded-full font-semibold transition-all ${
              activeTab === index
                ? "bg-[#006D68] text-[#F1FBFA] shadow-lg"
                : "text-[#002927] hover:bg-[#006D68]/10"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}
