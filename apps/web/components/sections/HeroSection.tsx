import type { PageBuilderSectionProps } from "@/sanity/queries/pageBuilder";
import { getHeading } from "../../lib/heading";
import GradientImage from "../../sanity/image/GradientImage";
import { Container } from "../ui/container";
import { Link } from "../ui/link";
import Typography from "../ui/typography";

const HeroSection = ({ data, index }: PageBuilderSectionProps<"heroSection">) => {
  return (
    <Container
      className="flex flex-col items-center gap-5 pb-0 desktop:gap-20"
      size="stretch"
      contentWidth="none"
    >
      <div className="flex flex-col items-center gap-6 px-4 pb-10 desktop:gap-14 desktop:px-0 desktop:pb-0">
        <div className="flex max-w-4xl flex-col items-center gap-8 text-center desktop:text-left">
          <Typography as={getHeading(index)} variant="h1" className="text-center text-balance">
            {data.heading}
          </Typography>
          <Typography className="text-center text-balance text-gray-600" variant="body-xl">
            {data.subheading}
          </Typography>
        </div>
        <div className="flex w-full max-w-md flex-col justify-center gap-4 desktop:flex-row desktop:gap-8">
          {data.cta && <Link size="l" link={data.cta} variant="primary" />}
          {data.secondaryCta && <Link size="l" link={data.secondaryCta} variant="secondary" />}
        </div>
      </div>
      {data.backgroundImage && (
        <GradientImage
          image={data.backgroundImage}
          className="hidden w-full desktop:block"
          sizes="100vw"
          direction="top"
          size="md"
          desktopSize="xl"
        />
      )}
    </Container>
  );
};

export default HeroSection;
