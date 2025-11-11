import Layout from "@/components/Layout";

interface PlaceholderProps {
  pageName: string;
}

export default function Placeholder({ pageName }: PlaceholderProps) {
  return (
    <Layout>
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="font-geist font-bold text-3xl text-azure-11 mb-4">
            {pageName}
          </h1>
          <p className="font-geist text-base text-azure-27 mb-6">
            This page is under construction. Please continue prompting to fill
            in this page's content.
          </p>
          <div className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-[#88D2EE] to-[#1FB1C4] shadow-lg">
            <span className="font-geist font-semibold text-white">
              Coming Soon
            </span>
          </div>
        </div>
      </div>
    </Layout>
  );
}
