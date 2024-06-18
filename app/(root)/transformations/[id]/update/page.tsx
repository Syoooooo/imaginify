import { redirect } from "next/navigation";

import { transformationTypes } from "@/constants";
import { currentUser } from "@/lib/auth";
import { getUserById } from "@/data/user";
import { getImageById } from "@/lib/cloudinaryActions/image.actions";
import { Header } from "@/components/shared/Header";
import { TransformationForm } from "@/components/shared/TransformationForm";

const Page = async ({ params: { id } }: SearchParamProps) => {
  const loginUser = await currentUser();

  if (!loginUser) redirect("/sign-in");

  const user = await getUserById(loginUser.id as string);
  const image = await getImageById(id);

  const transformation =
    transformationTypes[image.transformationType as TransformationTypeKey];

  return (
    <>
      <Header title={transformation.title} subtitle={transformation.subTitle} />

      <section className="mt-10">
        <TransformationForm
          action="Update"
          userId={loginUser.id as string}
          type={image.transformationType as TransformationTypeKey}
          creditBalance={loginUser.creditBalance}
          config={image.config}
          data={image}
        />
      </section>
    </>
  );
};

export default Page;