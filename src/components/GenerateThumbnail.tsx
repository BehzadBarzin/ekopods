import React, { Dispatch, FC, SetStateAction } from "react";
import { Id } from "@/../convex/_generated/dataModel";

interface IProps {
  setImage: Dispatch<SetStateAction<string>>;
  setImageStorageId: Dispatch<SetStateAction<Id<"_storage"> | null>>;
  image: string;
  imagePrompt: string;
  setImagePrompt: Dispatch<SetStateAction<string>>;
}
const GenerateThumbnail: FC<IProps> = () => {
  return <div>GenerateThumbnail</div>;
};

export default GenerateThumbnail;
