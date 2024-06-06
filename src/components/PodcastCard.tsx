import Image from "next/image";
import React, { FC } from "react";

interface IProps {
  podcastId: string;
  imgUrl: string;
  title: string;
  description: string;
}

const PodcastCard: FC<IProps> = ({ podcastId, imgUrl, title, description }) => {
  return (
    <div className="cursor-pointer ">
      <figure className="flex flex-col gap-2">
        <Image
          src={imgUrl}
          alt={title}
          width={174}
          height={174}
          className="aspect-square h-fit w-full rounded-xl 2xl:size-[200px]"
        />
        <div className="flex flex-col">
          <h1 className="text-16 truncate font-bold text-white-1">{title}</h1>
          <h2 className="text-12 truncate font-normal text-white-4 capitalize">
            {description}
          </h2>
        </div>
      </figure>
    </div>
  );
};

export default PodcastCard;
