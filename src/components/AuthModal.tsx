import UserAuthAPI from "@/api/user/auth/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { USERS_ROLES } from "@/constant/app";
import { useToast } from "@/hooks/use-toast";
import { useAppDispatch } from "@/hooks/use-typed-selector";
import { auth } from "@/lib/firebase";
import { setCredentials } from "@/provider/slices/authSlice";
import clsx from "clsx";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useFormik } from "formik";
import { Badge, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { FormControl } from "./molecules/Forms/FormControl";
import { InputText } from "./molecules/Forms/InputText";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { FormControlSelect } from "./molecules/Forms/FormControlSelect";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "register";
  callbackSuccessLogin?: () => void;
}

const provider = new GoogleAuthProvider();

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = "login",
  callbackSuccessLogin,
}) => {
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const { toast } = useToast();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      name: "",
      role: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email format")
        .required("Email Required"),
      password: Yup.string().required("Password Required"),
      name: Yup.string().when([], {
        is: () => mode === "register",
        then: (schema) => schema.required("Name is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
      role: Yup.string().when([], {
        is: () => mode === "register",
        then: (schema) => schema.required("Role is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
    }),
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setIsSubmitting(true);
        if (mode === "login") {
          const data = await UserAuthAPI.login({
            email: values.email,
            password: values.password,
          });
          dispatch(
            setCredentials({
              token: data.data.token,
              user: data.data,
            })
          );
          onClose();
          formik.resetForm();
          callbackSuccessLogin?.();
        } else {
          await UserAuthAPI.register({
            email: values.email,
            password: values.password,
            role: values.role,
            username: values.name,
          });
          toast({
            title: "Success",
            description: "Successfully create account",
            variant: "default",
          });
          setMode("login");
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.response.data.message || error.message,
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const toggleMode = () => {
    setMode(mode === "login" ? "register" : "login");
    setIsFormSubmitted(false);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsFormSubmitted(true);

    const errors = await formik.validateForm();

    if (Object.keys(errors).length === 0) {
      formik.handleSubmit(e as any);
    }
  };

  const googleAuth = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      if (mode === "login") {
        const data = await UserAuthAPI.googleLogin({ idToken });
        dispatch(
          setCredentials({
            token: data.data.token,
            user: data.data,
          })
        );
        onClose();
      } else {
        const data = await UserAuthAPI.googleSignup({ idToken });
        dispatch(
          setCredentials({
            token: data.data.token,
            user: data.data,
          })
        );
        onClose();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Error",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    setMode("login");
    formik.resetForm();
    setIsFormSubmitted(false);
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        classNameClose="!hidden"
        className="max-w-[439px] min-w-[439px] !rounded-b-[32px] !rounded-t-[12px] !gap-0 !m-0 !p-0 !border-none"
      >
        <DialogHeader
          className="
          h-[107px]
          flex gap-2
          pt-3 px-8 pb-3
          rounded-t-xl
          bg-gradient-to-r from-blue-600 to-purple-600
          shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.1),0px_10px_15px_-3px_rgba(0,0,0,0.1)] justify-center"
        >
          <div className="flex  items-center gap-2">
            {mode === "login" ? (
              <>
                <div className="flex flex-col items-start gap-1">
                  <p className="font-secondary font-bold text-[24px] !text-[#FFFFFF] leading-[100%] tracking-[0%]">
                    Login
                  </p>
                  <p className="font-secondary font-[300] text-[12px] !text-[#E1E1E1] leading-[100%] tracking-[0%]">
                    Welcome back to uxboard
                  </p>
                </div>
              </>
            ) : (
              <>
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M13.4731 4.33337C13.7431 3.72504 14.3447 3.33337 15.0114 3.33337H28.3064C29.5564 3.33337 30.3714 4.65004 29.8114 5.77004L26.0297 13.3334H31.6264C33.1264 13.3334 33.8764 15.1467 32.8164 16.2067L12.8947 36.1284C11.6381 37.385 9.54474 36.0917 10.1081 34.4067L14.3547 21.6667H8.35807C8.07765 21.6667 7.80167 21.5966 7.5552 21.4629C7.30873 21.3291 7.09959 21.1359 6.94676 20.9008C6.79393 20.6657 6.70226 20.3961 6.68008 20.1165C6.6579 19.837 6.70591 19.5563 6.81974 19.3L13.4731 4.33337Z"
                    fill="#F8B303"
                  />
                </svg>
                <div className="flex flex-col items-start gap-1">
                  <p className="font-secondary font-bold text-[24px] !text-[#FFFFFF] leading-[100%] tracking-[0%]">
                    Join Membership
                  </p>
                  <p className="font-secondary font-[300] text-[12px] !text-[#E1E1E1] leading-[100%] tracking-[0%]">
                    Join Free Today — Exclusive Offer Ends Soon!
                  </p>
                </div>
              </>
            )}
          </div>
        </DialogHeader>
        <div className="p-8 flex flex-col gap-4 items-start w-full">
          <form onSubmit={handleFormSubmit} className="w-full space-y-4">
            {mode === "register" && (
              <div className="space-y-2">
                <FormControl
                  isRequired={false}
                  isInvalid={isFormSubmitted && !!formik.errors.name}
                >
                  <InputText
                    autoFocus={false}
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    required={false}
                    label="Full Name"
                    onChange={formik.handleChange}
                    // onBlur={formik.handleBlur}
                    className="h-[44px]"
                    name="name"
                    isRequired={false}
                    value={formik.values.name}
                    isInvalid={isFormSubmitted && !!formik.errors.name}
                    errorMessage={formik.errors.name}
                    leftIcon={
                      <svg
                        className="absolute left-3 top-1/2 transform -translate-y-1/2"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4.66667 10.6667L6.66667 8.66668M6.66667 8.66668L8.66667 10.6667M6.66667 8.66668C6.38467 7.44668 5.752 6.65335 5 6.66668C4.474 6.66668 4 7.11468 4 7.66668C4 8.21868 4.80733 8.66668 5.33333 8.66668H8C8.526 8.66668 9.33333 8.21868 9.33333 7.66668C9.33333 7.11468 8.85933 6.66668 8.33333 6.66668C7.58133 6.65335 6.94867 7.44668 6.66667 8.66668ZM2 5.33334C2 4.80291 2.21071 4.2942 2.58579 3.91913C2.96086 3.54406 3.46957 3.33334 4 3.33334H12C12.5304 3.33334 13.0391 3.54406 13.4142 3.91913C13.7893 4.2942 14 4.80291 14 5.33334V10.6667C14 11.1971 13.7893 11.7058 13.4142 12.0809C13.0391 12.456 12.5304 12.6667 12 12.6667H4C3.46957 12.6667 2.96086 12.456 2.58579 12.0809C2.21071 11.7058 2 11.1971 2 10.6667V5.33334Z"
                          stroke="#323638"
                          stroke-width="1.2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    }
                  />
                </FormControl>
              </div>
            )}

            <div className="space-y-2">
              <FormControl
                isRequired={false}
                isInvalid={isFormSubmitted && !!formik.errors.email}
              >
                <InputText
                  autoFocus={false}
                  id="email"
                  type="email"
                  placeholder="hi@thebeaverops.com"
                  required={false}
                  label="Email"
                  onChange={formik.handleChange}
                  // onBlur={formik.handleBlur}
                  name="email"
                  className="h-[44px]"
                  isRequired={false}
                  value={formik.values.email}
                  isInvalid={isFormSubmitted && !!formik.errors.email}
                  errorMessage={formik.errors.email}
                  leftIcon={
                    <svg
                      className="absolute left-3 top-1/2 transform -translate-y-1/2"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2 4.66668C2 4.31305 2.14048 3.97392 2.39052 3.72387C2.64057 3.47382 2.97971 3.33334 3.33333 3.33334H12.6667C13.0203 3.33334 13.3594 3.47382 13.6095 3.72387C13.8595 3.97392 14 4.31305 14 4.66668M2 4.66668V11.3333C2 11.687 2.14048 12.0261 2.39052 12.2762C2.64057 12.5262 2.97971 12.6667 3.33333 12.6667H12.6667C13.0203 12.6667 13.3594 12.5262 13.6095 12.2762C13.8595 12.0261 14 11.687 14 11.3333V4.66668M2 4.66668L8 8.66668L14 4.66668"
                        stroke="#323638"
                        stroke-width="1.2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  }
                />
              </FormControl>
            </div>

            {mode === "register" && (
              <div className="space-y-2">
                <FormControlSelect
                  label="Roles"
                  isRequired={false}
                  isInvalid={isFormSubmitted && !!formik.errors.role}
                  errorMessage={formik.errors.role}
                >
                  <Select
                    value={formik.values.role}
                    onValueChange={(value) =>
                      formik.setFieldValue("role", value)
                    }
                  >
                    <SelectTrigger className="h-[44px] rounded-[8px] !text-body-4">
                      <div className="relative pl-[22px]">
                        <svg
                          className="absolute left-0 top-1/2 transform -translate-y-1/2"
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M5.66683 6.99998L5.00016 5.33331H1.3335L2.98683 9.19198C3.08971 9.43198 3.2608 9.63649 3.47887 9.78013C3.69693 9.92377 3.95237 10.0002 4.2135 9.99998H5.66683M10.3335 6.99998L11.0002 5.33331H14.6668L13.0135 9.19198C12.9106 9.43198 12.7395 9.63649 12.5215 9.78013C12.3034 9.92377 12.048 10.0002 11.7868 9.99998H10.3335M5.3335 8.66665C5.3335 9.37389 5.61445 10.0522 6.11454 10.5523C6.61464 11.0524 7.29292 11.3333 8.00016 11.3333C8.70741 11.3333 9.38568 11.0524 9.88578 10.5523C10.3859 10.0522 10.6668 9.37389 10.6668 8.66665C10.6668 7.9594 10.3859 7.28112 9.88578 6.78103C9.38568 6.28093 8.70741 5.99998 8.00016 5.99998C7.29292 5.99998 6.61464 6.28093 6.11454 6.78103C5.61445 7.28112 5.3335 7.9594 5.3335 8.66665Z"
                            stroke="#323638"
                            stroke-width="1.2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>

                        <SelectValue placeholder="Select Roles" />
                      </div>
                    </SelectTrigger>
                    <SelectContent
                      className="bg-white rounded-[12px]"
                      classNameMenu="!m-0 !p-0"
                    >
                      {USERS_ROLES.map((d, i) => (
                        <SelectItem
                          className="!items-start !py-[9px] !px-2 truncate"
                          key={i}
                          isRemoveCheckIndocator
                          withRoundedEdge
                          value={d}
                        >
                          {d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControlSelect>
              </div>
            )}

            <div className="flex flex-col w-full gap-2">
              <div className="space-y-2">
                <FormControl
                  isRequired={false}
                  isInvalid={isFormSubmitted && !!formik.errors.password}
                >
                  <InputText
                    autoFocus={false}
                    id="password"
                    type="password"
                    placeholder="***********"
                    required={false}
                    label="Password"
                    onChange={formik.handleChange}
                    // onBlur={formik.handleBlur}
                    name="password"
                    className="h-[44px]"
                    isRequired={false}
                    value={formik.values.password}
                    isInvalid={isFormSubmitted && !!formik.errors.password}
                    errorMessage={formik.errors.password}
                    leftIcon={
                      <svg
                        className="absolute left-3 top-1/2 transform -translate-y-1/2"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5.3335 7.33333V4.66667C5.3335 3.95942 5.61445 3.28115 6.11454 2.78105C6.61464 2.28095 7.29292 2 8.00016 2C8.70741 2 9.38568 2.28095 9.88578 2.78105C10.3859 3.28115 10.6668 3.95942 10.6668 4.66667V7.33333M3.3335 8.66667C3.3335 8.31304 3.47397 7.97391 3.72402 7.72386C3.97407 7.47381 4.31321 7.33333 4.66683 7.33333H11.3335C11.6871 7.33333 12.0263 7.47381 12.2763 7.72386C12.5264 7.97391 12.6668 8.31304 12.6668 8.66667V12.6667C12.6668 13.0203 12.5264 13.3594 12.2763 13.6095C12.0263 13.8595 11.6871 14 11.3335 14H4.66683C4.31321 14 3.97407 13.8595 3.72402 13.6095C3.47397 13.3594 3.3335 13.0203 3.3335 12.6667V8.66667ZM7.3335 10.6667C7.3335 10.8435 7.40373 11.013 7.52876 11.1381C7.65378 11.2631 7.82335 11.3333 8.00016 11.3333C8.17697 11.3333 8.34654 11.2631 8.47157 11.1381C8.59659 11.013 8.66683 10.8435 8.66683 10.6667C8.66683 10.4899 8.59659 10.3203 8.47157 10.1953C8.34654 10.0702 8.17697 10 8.00016 10C7.82335 10 7.65378 10.0702 7.52876 10.1953C7.40373 10.3203 7.3335 10.4899 7.3335 10.6667Z"
                          stroke="#323638"
                          stroke-width="1.2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    }
                  />
                </FormControl>

                {mode === "login" && (
                  <p className="text-body-4 text-right hover:cursor-pointer font-medium text-black">
                    forgot password?
                  </p>
                )}
              </div>
            </div>
            <div className={clsx("flex flex-col items-center gap-3 !mt-6")}>
              <Button
                type="submit"
                className={clsx(
                  "font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 px-4 py-3 h-11 w-full rounded-2xl text-sm lg:text-base",
                  isSubmitting && "cursor-progress"
                )}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                {mode === "login" ? "Login" : "Join"}
              </Button>
              <p className="text-body-4 font-normal text-black">or</p>
              <div className="p-[1px] w-full rounded-[16px] bg-gradient-to-r from-blue-600 to-purple-600">
                <Button
                  type="submit"
                  variant="outline"
                  onClick={googleAuth}
                  className="w-full h-11 font-bold text-sm lg:text-base rounded-[16px] bg-white text-black"
                >
                  <svg
                    width="17"
                    height="16"
                    viewBox="0 0 17 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      opacity="0.987"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M7.70875 1.06099C8.43375 0.979994 8.86275 0.979994 9.64175 1.06099C11.0207 1.26509 12.299 1.90248 13.2918 2.88099C12.6209 3.51513 11.9588 4.15852 11.3058 4.81099C10.0551 3.75099 8.65909 3.50633 7.11775 4.07699C5.98709 4.59699 5.19975 5.43966 4.75575 6.60499C4.03019 6.06482 3.31409 5.51207 2.60775 4.94699C2.55867 4.92116 2.5026 4.9117 2.44775 4.91999C3.56975 2.75666 5.32309 1.46999 7.70775 1.05999"
                      fill="#F44336"
                    />
                    <path
                      opacity="0.997"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M2.44576 4.92C2.50243 4.91133 2.5561 4.92033 2.60676 4.947C3.3131 5.51208 4.0292 6.06483 4.75476 6.605C4.64059 7.05906 4.56862 7.52269 4.53976 7.99C4.56443 8.442 4.6361 8.88566 4.75476 9.321L2.49976 11.116C1.51776 9.064 1.49976 6.99866 2.44576 4.92Z"
                      fill="#FFC107"
                    />
                    <path
                      opacity="0.999"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M13.1846 13.29C12.4824 12.6708 11.7474 12.0899 10.9826 11.55C11.7492 11.0087 12.2146 10.266 12.3786 9.32199H8.62158V6.71299C10.7882 6.69499 12.9539 6.71332 15.1186 6.76799C15.5292 8.99799 15.0549 11.0087 13.6956 12.8C13.5339 12.9718 13.3627 13.1354 13.1846 13.29Z"
                      fill="#448AFF"
                    />
                    <path
                      opacity="0.993"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M4.755 9.32202C5.575 11.36 7.07833 12.3114 9.265 12.176C9.87883 12.105 10.4673 11.8905 10.983 11.55C11.7483 12.0914 12.4823 12.6714 13.185 13.29C12.0716 14.2905 10.6521 14.8841 9.158 14.974C8.81854 15.0012 8.47746 15.0012 8.138 14.974C5.59267 14.674 3.71333 13.388 2.5 11.116L4.755 9.32202Z"
                      fill="#43A047"
                    />
                  </svg>

                  {mode === "login"
                    ? "Sign In using Google"
                    : "Sign Up using Google"}
                </Button>
              </div>
            </div>
          </form>
          <div className="flex justify-center items-center w-full">
            <p className="w-full text-sm text-[#000000] text-center">
              {mode === "login"
                ? "Don’t have an account ?"
                : "Already have an account?"}
              <span
                className="font-bold hover:cursor-pointer"
                onClick={toggleMode}
              >
                {" "}
                {mode === "login" ? "Join us here" : "Click here to Login"}
              </span>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
