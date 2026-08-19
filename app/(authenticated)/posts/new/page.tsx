import PageLayout from "@/components/page-layout";
import PostForm from "../../../../components/posts/post-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


export default function PostPage() {
  return (
    <PageLayout title={"Report a Lost or Found Item"}>
      <Tabs defaultValue={"lost"}>
        <TabsList>
          <TabsTrigger value="lost">I Lost Something</TabsTrigger>
          <TabsTrigger value="found">I Found Something</TabsTrigger>
        </TabsList>
        <TabsContent value="lost">
          <PostForm postType={"lost"} />
        </TabsContent>
        <TabsContent value="found">
          <PostForm postType={"found"} />
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
}
