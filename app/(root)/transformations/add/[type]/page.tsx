import { Header } from "@/components/shared/Header";
import { TransformationForm } from "@/components/shared/TransformationForm";
import { transformationTypes } from "@/constants";
import { currentUser } from "@/lib/auth";

declare type TransformationTypeKey =
  | "restore"
  | "fill"
  | "remove"
  | "recolor"
  | "removeBackground";

declare type SearchParamProps = {
  params: { id: string; type: TransformationTypeKey };
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

const AddTransformationTypePage = async ({
  params: { type },
}: SearchParamProps) => {
  const transformation = transformationTypes[type];
  const user = await currentUser();

  return (
    <>
      <Header
        title={transformation.title}
        subtitle={transformation.subTitle}
      />
      <section className="mt-10">
        <TransformationForm
          action="Add"
          userId={user!.id as string}
          type={
            transformation.type as TransformationTypeKey
          }
          creditBalance={user?.creditBalance}
        />
      </section>
    </>
  );
};
export default AddTransformationTypePage;
