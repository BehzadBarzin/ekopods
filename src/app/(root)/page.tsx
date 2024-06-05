import PodcastCard from "@/components/PodcastCard";
import { podcastData, TPodcastData } from "@/constants";

const Home = () => {
  return (
    <div className="mt-9 flex flex-col gap-9">
      <section className="flex flex-col gap-5">
        <h1 className="text-20 font-bold text-white-1">Trending Podcasts</h1>
        <div className="podcast_grid">
          {podcastData.map((pd: TPodcastData) => {
            return (
              <PodcastCard
                key={pd.id}
                podcastId={pd.id}
                imgUrl={pd.imgURL}
                title={pd.title}
                description={pd.description}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Home;
