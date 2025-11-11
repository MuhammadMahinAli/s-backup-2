import React from "react";
import { X, ExternalLink, CheckCircle, Lightbulb, Phone } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogOverlay
} from "./dialog";
import { EducationTopic } from "../../data/educationTopics";

interface TopicDialogProps {
  topic: EducationTopic | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TopicDialog({ topic, open, onOpenChange }: TopicDialogProps) {
  if (!topic) return null;

  const IconComponent = topic.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <div className="flex items-center gap-3">
            <IconComponent className="w-8 h-8 text-[#0079C1]" />
            <DialogTitle className="text-2xl font-bold text-[#080C0F]">
              {topic.title}
            </DialogTitle>
          </div>
          <DialogDescription className="text-lg text-[#6D7277]">
            {topic.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8 mt-6">
          {/* Overview Section */}
          <section>
            <h3 className="text-xl font-semibold text-[#080C0F] mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[#0079C1]" />
              Overview
            </h3>
            <p className="text-[#6D7277] leading-relaxed">
              {topic.detailedContent.overview}
            </p>
          </section>

          {/* Key Points Section */}
          <section>
            <h3 className="text-xl font-semibold text-[#080C0F] mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[#0079C1]" />
              Key Points
            </h3>
            <ul className="space-y-3">
              {topic.detailedContent.keyPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#0079C1] rounded-full mt-2 flex-shrink-0" />
                  <span className="text-[#6D7277] leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Resources Section */}
          <section>
            <h3 className="text-xl font-semibold text-[#080C0F] mb-4 flex items-center gap-2">
              <ExternalLink className="w-5 h-5 text-[#0079C1]" />
              Resources
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {topic.detailedContent.resources.map((resource, index) => (
                <div
                  key={index}
                  className="bg-[#F3FAFF]/75 border border-[#D3E0EA]/25 rounded-lg p-4 hover:shadow-sm transition-shadow"
                >
                  <h4 className="font-semibold text-[#080C0F] mb-2 flex items-center gap-2">
                    <ExternalLink className="w-4 h-4 text-[#0079C1]" />
                    {resource.title}
                  </h4>
                  <p className="text-sm text-[#6D7277] leading-relaxed">
                    {resource.description}
                  </p>
                  {resource.link && (
                    <a
                      href={resource.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-[#0079C1] hover:underline mt-2"
                    >
                      Learn more
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Tips Section */}
          <section>
            <h3 className="text-xl font-semibold text-[#080C0F] mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-[#0079C1]" />
              Helpful Tips
            </h3>
            <div className="bg-[#FFF9E5] border-l-4 border-[#F59E0B] p-4 rounded-r-lg">
              <ul className="space-y-2">
                {topic.detailedContent.tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Lightbulb className="w-4 h-4 text-[#F59E0B] mt-0.5 flex-shrink-0" />
                    <span className="text-[#92400E] text-sm leading-relaxed">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Get Help Section */}
          <section>
            <h3 className="text-xl font-semibold text-[#080C0F] mb-3 flex items-center gap-2">
              <Phone className="w-5 h-5 text-[#0079C1]" />
              Getting Help
            </h3>
            <div className="bg-[#E0F7FA] border border-[#4DD0E1]/25 rounded-lg p-4">
              <p className="text-[#006064] leading-relaxed">
                {topic.detailedContent.getHelp}
              </p>
            </div>
          </section>
        </div>

        {/* Footer with action buttons */}
        <div className="flex justify-between items-center pt-6 mt-8 border-t border-[#D3E0EA]/25">
          <button
            onClick={() => onOpenChange(false)}
            className="px-6 py-2 text-[#6D7277] hover:text-[#080C0F] transition-colors"
          >
            Close
          </button>
          <div className="flex gap-3">
            <button className="px-6 py-2 bg-[#F3FAFF] text-[#0079C1] border border-[#0079C1] rounded-lg hover:bg-[#0079C1] hover:text-white transition-colors">
              Find Local Resources
            </button>
            <button className="px-6 py-2 bg-[#0079C1] text-white rounded-lg hover:bg-[#005A8F] transition-colors">
              Get Support
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
