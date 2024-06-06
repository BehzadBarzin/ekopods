import React, { FC, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { EmblaCarouselType } from "embla-carousel";
import { DotButton, useDotButton } from "@/components/EmblaCarouselDotButton";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import LoaderSpinner from "@/components/LoaderSpinner";
import { Id } from "@/../convex/_generated/dataModel";

interface TopEkopodstersProps {
  _id: Id<"users">;
  _creationTime: number;
  email: string;
  imageUrl: string;
  clerkId: string;
  name: string;
  podcast: {
    podcastTitle: string;
    podcastId: Id<"podcasts">;
  }[];
  totalPodcasts: number;
}

interface IProps {
  fansLikeDetail: TopEkopodstersProps[];
}

const EmblaCarousel: FC<IProps> = ({ fansLikeDetail }) => {
  // ---------------------------------------------------------------------------
  const router = useRouter();
  // ---------------------------------------------------------------------------
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, []);
  // ---------------------------------------------------------------------------
  const onNavButtonClick = useCallback((emblaApi: EmblaCarouselType) => {
    const autoplay = emblaApi?.plugins()?.autoplay;
    if (!autoplay || !("stopOnInteraction" in autoplay.options)) return;

    const resetOrStop =
      autoplay.options.stopOnInteraction === false
        ? (autoplay.reset as () => void)
        : (autoplay.stop as () => void);

    resetOrStop();
  }, []);
  // ---------------------------------------------------------------------------
  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(
    emblaApi,
    onNavButtonClick
  );
  // ---------------------------------------------------------------------------
  const slides =
    fansLikeDetail &&
    fansLikeDetail?.filter((item: any) => item.totalPodcasts > 0);
  // ---------------------------------------------------------------------------
  // If no data, show loader
  if (!slides) return <LoaderSpinner />;
  // ---------------------------------------------------------------------------

  return (
    <section
      className="flex w-full flex-col gap-4 overflow-hidden"
      ref={emblaRef}
    >
      <div className="flex">
        {slides.slice(0, 5).map((item) => (
          <figure
            key={item._id}
            className="carousel_box"
            onClick={() =>
              router.push(`/podcasts/${item.podcast[0]?.podcastId}`)
            }
          >
            <Image
              src={item.imageUrl}
              alt="card"
              fill
              className="absolute size-full rounded-xl border-none"
            />
            <div className="glassmorphism-black relative z-10 flex flex-col rounded-b-xl p-4">
              <h2 className="text-14 font-semibold text-white-1">
                {item.podcast[0]?.podcastTitle}
              </h2>
              <p className="text-12 font-normal text-white-2">{item.name}</p>
            </div>
          </figure>
        ))}
      </div>
      <div className="flex justify-center gap-2">
        {scrollSnaps.map((_, index) => (
          <DotButton
            key={index}
            onClick={() => onDotButtonClick(index)}
            selected={index === selectedIndex}
          />
        ))}
      </div>
    </section>
  );
};

export default EmblaCarousel;
