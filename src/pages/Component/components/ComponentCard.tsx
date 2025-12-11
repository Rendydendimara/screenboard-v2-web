import { TGlobalComponentRes } from "@/api/user/globalComponent/type";
import { getImageUrl } from "@/utils";

interface IProps {
  component: TGlobalComponentRes;
  onDetail: (appId: string) => void;
}

const ComponentCard = ({ component, onDetail }: IProps) => {
  return (
    <>
      <div className="flex flex-col gap-6">
        <h2 className="font-[Inter] font-bold text-[24px] leading-[150%] tracking-[0%] align-middle text-[#020817]">
          {component.name ?? "-"}
        </h2>
        <div className="grid grid-cols-1 items-start sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {component.screenshots.slice(0, 10).map((img, i) => (
            <div key={i} className="flex flex-col gap-5">
              <div className="w-full overflow-hidden">
                <img
                  onClick={() => onDetail(`${component._id}?imgid=${img._id}`)}
                  src={getImageUrl(img.filePath)}
                  alt="Figma Configuration Screen"
                  className="w-[231px] h-[143px] rounded-[11px] object-cover hover:cursor-pointer"
                />
              </div>
              <p className="font-[Inter] font-medium text-[14px] leading-[100%] tracking-[0%] align-middle text-[#565D61]">
                {img.fileName}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ComponentCard;
