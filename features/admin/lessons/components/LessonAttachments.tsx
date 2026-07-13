import { Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatFileSize } from '../utils/lesson.utils';

type Attachment = {
  id: string;
  name: string;
  url: string;
  size: number;
};

type LessonAttachmentsProps = {
  attachments?: Attachment[];
};

export function LessonAttachments({ attachments }: LessonAttachmentsProps) {
  if (!attachments || attachments.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
        <Download className="h-4 w-4 text-[#8557E5]" />
        Lampiran
      </h4>
      <div className="space-y-2">
        {attachments.map((att) => (
          <div key={att.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-[#8557E5]/30 hover:bg-gray-50 transition-all">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-[#8557E5]" />
              <div>
                <p className="text-sm font-medium text-gray-700">{att.name}</p>
                <p className="text-xs text-gray-400">{formatFileSize(att.size)}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-[#8557E5] hover:text-[#6f44c9]">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
