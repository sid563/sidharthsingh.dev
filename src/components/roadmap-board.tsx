"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type RoadmapBoardProps = {
  /** Pre-rendered server view grouped by status. */
  statusView: React.ReactNode;
  /** Pre-rendered server view grouped by theme. */
  themeView: React.ReactNode;
  /** Optional legend rendered next to the tab switcher. */
  legend?: React.ReactNode;
};

/**
 * Thin client shell: only the tab state lives here. The cards themselves are
 * server-rendered and passed in, so this component never touches the content
 * layer (which reads from the filesystem).
 */
export function RoadmapBoard({ statusView, themeView, legend }: RoadmapBoardProps) {
  return (
    <Tabs defaultValue="status">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <TabsList variant="line" aria-label="Group roadmap">
          <TabsTrigger value="status">By status</TabsTrigger>
          <TabsTrigger value="theme">By theme</TabsTrigger>
        </TabsList>
        {legend}
      </div>
      <TabsContent value="status" className="mt-8">
        {statusView}
      </TabsContent>
      <TabsContent value="theme" className="mt-8">
        {themeView}
      </TabsContent>
    </Tabs>
  );
}
