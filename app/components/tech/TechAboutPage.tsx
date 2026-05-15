import { BookOpen, Info, Sparkles } from "lucide-react";
import { AdminArrayItemsEditor } from "../admin/AdminArrayItemsEditor";
import { AdminSimpleEntityForm } from "../admin/AdminSimpleEntityForm";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useAdminSession } from "../../hooks/useAdminSession";
import type { TechEntity, TechPageCopy } from "./types";

interface TechAboutPageProps {
  copy: TechPageCopy;
  data: TechEntity;
  labels: {
    about: string;
    insights: string;
    interview: string;
  };
}

export const TechAboutPage = ({ copy, data, labels }: TechAboutPageProps) => {
  const { isAdminAuthenticated } = useAdminSession();

  return (
    <div className="space-y-12 max-w-4xl">
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest text-xs">
          <Info className="w-4 h-4" />
          {labels.about}
        </div>
        <p className="text-xl text-foreground/80 leading-relaxed font-medium">
          {data.aboutDescription || data.description}
        </p>
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        {data.insights.length > 0 && (
            <Card className="border-none bg-blue-50/50 dark:bg-blue-900/10 shadow-sm overflow-hidden relative">
            <div className="absolute top-0 right-0 p-6 opacity-10">
                <Sparkles className="w-12 h-12 text-blue-600" />
            </div>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{labels.insights}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-4xl font-black text-blue-600 dark:text-blue-400">
                {data.insights.length}
                </div>
                <p className="text-xs text-muted-foreground mt-2">{copy.insightAboutCaption}</p>
            </CardContent>
            </Card>
        )}

        {data.interviewQuestions.length > 0 && (
            <Card className="border-none bg-purple-50/50 dark:bg-purple-900/10 shadow-sm overflow-hidden relative">
            <div className="absolute top-0 right-0 p-6 opacity-10">
                <BookOpen className="w-12 h-12 text-purple-600" />
            </div>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{labels.interview}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-4xl font-black text-purple-600 dark:text-purple-400">
                {data.interviewQuestions.length}
                </div>
                <p className="text-xs text-muted-foreground mt-2">{copy.interviewAboutCaption}</p>
            </CardContent>
            </Card>
        )}
      </div>

      {isAdminAuthenticated ? (
        <div className="space-y-8 pt-12 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-blue-600">{copy.adminContentLabel}</span>
            <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
          </div>

          <AdminSimpleEntityForm
            title={copy.descriptionEditorTitle}
            description={copy.descriptionEditorDescription}
            collection={copy.collection}
            itemId={data.slug}
            entity={data}
          />

          <AdminArrayItemsEditor
            title="Insights Manager"
            description={copy.insightsAdminDescription}
            items={data.insights}
            entity={data}
            entityField="insights"
            collection={copy.collection}
            itemId={data.slug}
          />

          <AdminArrayItemsEditor
            title="Interview Questions Manager"
            description={copy.interviewAdminDescription}
            items={data.interviewQuestions}
            entity={data}
            entityField="interviewQuestions"
            collection={copy.collection}
            itemId={data.slug}
          />
        </div>
      ) : null}
    </div>
  );
};
