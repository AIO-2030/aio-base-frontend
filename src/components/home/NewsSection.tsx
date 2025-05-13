
import { Badge } from "@/components/ui/badge";

interface NewsItem {
  id: string;
  title: string;
  subtitle?: string;
  author?: string;
  description: string;
  isNew: boolean;
}

interface NewsSectionProps {
  newsItems: NewsItem[];
}

const NewsSection = ({ newsItems }: NewsSectionProps) => {
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-semibold mb-6">NEWS</h2>
      <div className="flex flex-col space-y-8">
        {newsItems.map((news) => (
          <div 
            key={news.id}
            className="border-b border-border/30 pb-8 last:border-0"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-bold">{news.title}</h3>
              {news.isNew && (
                <Badge variant="default" className="bg-orange-500 hover:bg-orange-600">NEW</Badge>
              )}
            </div>
            
            <div className="text-muted-foreground mb-3">
              {news.author && <p>{news.author}</p>}
              {news.subtitle && <p>{news.subtitle}</p>}
            </div>
            
            {news.description && (
              <p className="text-muted-foreground">{news.description}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default NewsSection;
