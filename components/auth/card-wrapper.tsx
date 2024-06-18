import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "../ui/card";
import { Social } from "./social";
import { Button } from "../ui/button";

interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHrefLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
}

export const CardWrapper = ({
  children,
  headerLabel,
  backButtonHref,
  backButtonHrefLabel,
  backButtonLabel,
  showSocial,
}: CardWrapperProps) => {
  return (
    <Card className="w-[378px] shadow-md">
      <CardHeader>
        <h1 className="font-bold text-xl">{headerLabel}</h1>
        <p className="text-muted-foreground font-semibold text-lg">
          to continue to JSM_Imaginify
        </p>
      </CardHeader>
      <CardContent>
        <Social />
        {children}
      </CardContent>
      <CardFooter className="">
        <span className="text-sm text-muted-foreground font-medium">
          {backButtonLabel}
        </span>
        <Button variant={"link"} className="p-1" asChild>
          <Link href={backButtonHref}>
            {backButtonHrefLabel}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
