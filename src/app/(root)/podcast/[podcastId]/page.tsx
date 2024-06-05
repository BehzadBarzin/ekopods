import React, { FC } from "react";

interface IProps {
  params: {
    podcastId: string;
  };
}

const PodcastDetails: FC<IProps> = ({ params }) => {
  return <div>PodcastDetails</div>;
};

export default PodcastDetails;
