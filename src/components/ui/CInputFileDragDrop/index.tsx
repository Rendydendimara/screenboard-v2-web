import {
  MAX_SIZE_FILE_UPLOAD,
  MESSAGE_FILE_INVALID_FORMAT,
  MESSAGE_FILE_MAXIMUM_SIZE,
} from "@/constant/app";
import { getImageUrl } from "@/utils";
import clsx from "clsx";
import { Edit, Trash } from "lucide-react";
import React from "react";
import Dropzone from "react-dropzone";
import { Button } from "../button";
import { useToast } from "../use-toast";

interface IProps {
  file?: File | null;
  handleDrop: (data: any) => void;
  acceptFile: any;
  labelForm: string;
  labelBtn: string;
  isRequired?: boolean;
  type?: "inputSVG" | "inForm";
  label?: string;
  onRemove?: () => void;
  className?: string;
  multiple?: boolean;
  maxFile?: number;
  inputRef?: any;
}

const CInputFileDragDrop: React.FC<IProps> = (props) => {
  const { toast } = useToast();

  const handleDrop = (data: any) => {
    let extension = ["jpg", "jpeg", "png", "svg"];
    if (!props.multiple) {
      if (props.type === "inputSVG") {
        extension = ["svg"];
      }
      const file = data[0];
      if (file) {
        const fileName = file.name.match(/\.[0-9a-z]+$/i)[0];
        const fileFormat = fileName.substring(1);
        const isImage = extension.includes(fileFormat.toLowerCase()) ?? false;

        if (!isImage) {
          toast({
            title: MESSAGE_FILE_INVALID_FORMAT.title,
            description: MESSAGE_FILE_INVALID_FORMAT.message,
          });
          return;
        }
        if (file.size > MAX_SIZE_FILE_UPLOAD) {
          toast({
            title: MESSAGE_FILE_MAXIMUM_SIZE.title,
            description: MESSAGE_FILE_MAXIMUM_SIZE.message("4"),
          });
          return;
        }
        props.handleDrop(file);
      }
    } else {
      let isHaveError = false;
      data.forEach((file: any) => {
        if (file) {
          const fileName = file.name.match(/\.[0-9a-z]+$/i)[0];
          const fileFormat = fileName.substring(1);
          const isImage = extension.includes(fileFormat.toLowerCase()) ?? false;

          if (!isImage) {
            toast({
              title: MESSAGE_FILE_INVALID_FORMAT.title,
              description: MESSAGE_FILE_INVALID_FORMAT.message,
            });
            isHaveError = true;
            return;
          }
          if (file.size > MAX_SIZE_FILE_UPLOAD) {
            toast({
              title: MESSAGE_FILE_MAXIMUM_SIZE.title,
              description: MESSAGE_FILE_MAXIMUM_SIZE.message("4"),
            });
            isHaveError = true;
            return;
          }
        }
      });
      if (!isHaveError) {
        props.handleDrop(data);
      }
    }
  };

  const handleFileChangeSVG = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      if (file.type === "image/svg+xml") {
        props.handleDrop(file);
      } else {
        toast({
          title: MESSAGE_FILE_INVALID_FORMAT.title,
          description: "Upload SVG File",
        });
      }
    }
  };

  // const handleOpen = () => {
  //   if (props.inputRef?.current) {
  //     props.inputRef.current.click();
  //   }
  // };

  return (
    <div className="flex w-full flex-col items-start gap-3">
      <label className="block text-sm font-medium mb-2">
        {props.labelForm}
      </label>

      <Dropzone
        multiple={props.multiple}
        onDrop={handleDrop}
        accept={props.acceptFile}
        maxFiles={props.maxFile}
      >
        {({ getRootProps, getInputProps }) => (
          <div className="w-full" {...getRootProps()}>
            <input {...getInputProps()} />
            <div
              className={clsx(
                "flex h-[200px] w-full flex-col items-center justify-center gap-6 rounded-lg border border-dashed border-[#2193D1] bg-[#E9F4FA] py-6",
                props.className
              )}
            >
              {/* <Button size="sm">{props.labelBtn}</Button> */}
              <div className="flex flex-col items-center justify-center gap-3">
                <div
                  className={clsx(
                    "flex items-center",
                    props.type === "inForm" ? "gap-[5px]" : "gap-2"
                  )}
                >
                  <p className="text-[#F00000]">Click to Upload</p>
                  <p className="text-[#111111]">or Drag & Drop</p>
                </div>
                <p className="text-[#777777]">jpeg, jpg, png</p>
                <p
                  className={clsx(
                    "font-primary italic leading-[16px] text-[#777777]",
                    props.type === "inForm" ? "text-[10px]" : "text-[12px]"
                  )}
                >
                  Max 4MB
                </p>
              </div>
            </div>
          </div>
        )}
      </Dropzone>
    </div>
  );
};

export default CInputFileDragDrop;

// Tailwind version of CInputFilePreview

interface ICInputFilePreview {
  src: string;
  labelForm?: string;
  onEdit?: () => void;
  onRemove: () => void;
  type?: "inputSVG";
  className?: string;
}

const CInputFilePreview: React.FC<ICInputFilePreview> = ({
  src,
  labelForm = "Preview",
  onEdit,
  onRemove,
  type,
  className,
}) => {
  return (
    <div
      className={clsx(
        "flex flex-col items-start",
        type === "inputSVG" ? "w-full gap-2" : "w-full gap-3",
        className
      )}
    >
      <label className="block text-sm font-medium mb-2">{labelForm}</label>
      {src && type === "inputSVG" && (
        <div className="relative w-auto">
          <img
            alt="img"
            src={src.includes("/uploads") ? getImageUrl(src) : src}
            className="h-12 w-12 object-contain object-center"
          />
        </div>
      )}
      {src && type !== "inputSVG" && (
        <div className="relative h-[200px] w-auto">
          <img
            alt="img"
            src={src.includes("/uploads") ? getImageUrl(src) : src}
            className="rounded-lg h-[200px] w-auto object-cover object-center"
          />
          <div className="absolute bottom-4 right-4 flex items-center gap-4">
            {onEdit && (
              <div
                onClick={onEdit}
                className="flex items-center justify-center rounded-md bg-[#2193D1] p-1 cursor-pointer"
              >
                <Edit />
              </div>
            )}
            <div
              onClick={onRemove}
              className="flex items-center justify-center rounded-md bg-[#F00000] p-1 cursor-pointer"
            >
              <Trash color="white" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { CInputFilePreview };
