import type { PageBuilderSectionProps } from "@/sanity/queries/pageBuilder";
import { getHeading } from "../../lib/heading";
import { Container } from "../ui/container";
import { Link } from "../ui/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import Typography from "../ui/typography";
import { ChevronRight } from "lucide-react";
import PersonCard from "../ui/person-card";

const PeopleSection = async ({ index, data }: PageBuilderSectionProps<"peopleSection">) => {
  const groups = data.people?.filter((group) => group.groupName && group.members) ?? [];
  return (
    <Container
      background="slate"
      contentWidth="xl"
      contentClassName="flex flex-col items-center gap-8 desktop:gap-12"
    >
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 desktop:gap-16">
        <Typography variant="h2" as={getHeading(index)} className="text-center">
          {data.heading}
        </Typography>
        {data.subheading && (
          <Typography variant="body-l" className="text-center text-balance text-gray-600">
            {data.subheading}
          </Typography>
        )}
      </div>
      <Tabs
        defaultValue={groups[0]?.groupName ?? ""}
        className="flex w-full max-w-full gap-6 desktop:gap-8 desktop:px-0"
      >
        {groups.length > 1 && (
          <TabsList variant="line" className="gap-20">
            {groups.map((group, index) => (
              <TabsTrigger
                key={`${group._key}-${index}`}
                value={group.groupName ?? ""}
                className="max-w-60 flex-none"
              >
                {group.groupName}
              </TabsTrigger>
            ))}
          </TabsList>
        )}
        {groups.map((group, index) => (
          <TabsContent key={`${group._key}-${index}`} value={group.groupName ?? ""}>
            <div className="flex w-full flex-row flex-wrap items-stretch justify-center gap-4 md:gap-8">
              {group.members?.map((member) => (
                <PersonCard key={member._key} person={member.person} />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
      <div className="mx-auto mt-16 w-fit">
        {data.link && <Link link={data.link} variant="secondary" iconRight={<ChevronRight />} />}
      </div>
    </Container>
  );
};

export default PeopleSection;
