import type { PageBuilderSectionProps } from "@/sanity/queries/pageBuilder";
import { getHeading } from "../../lib/heading";
import GradientImage from "../../sanity/image/GradientImage";
import { Container } from "../ui/container";
import { Link } from "../ui/link";
import Typography from "../ui/typography";

const SupportUsSection = ({ data, index }: PageBuilderSectionProps<"supportUsSection">) => {
  return (
    <Container
      background="blue"
      size="stretch"
      className="flex flex-col pt-0 pb-8 desktop:flex-row desktop:py-0"
      contentWidth="none"
      contentClassName="sm:flex"
    >
      <GradientImage
        image={data.image}
        sizes={{
          default: "100vw",
          desktop: "60vw",
        }}
        className="h-full object-cover"
        wrapperClassName="desktop:w-fit"
        direction="bottom"
        desktopDirection="right"
        color="blue"
        size="sm"
        desktopSize="md"
      />
      <div className="mx-auto flex w-full flex-col items-stretch gap-16 px-2 pt-8 text-center desktop:w-5/11 desktop:justify-center desktop:gap-8 desktop:px-10">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-6">
            <Typography variant="h2" as={getHeading(index)} className="text-white">
              {data.heading}
            </Typography>
            <Typography variant="body-xl" className="text-gray-300">
              {data.subheading}
            </Typography>
          </div>
          <Typography variant="body-m" className="text-gray-300">
            {data.description}
          </Typography>
        </div>
        {data.cta && <Link link={data.cta} variant="primary" />}
      </div>
    </Container>
  );
};

export default SupportUsSection;
