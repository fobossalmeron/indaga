import { PlaceCard } from "@/app/guia/PlaceCard";

interface Step {
  step_title: string;
  step_area: string;
  step_map_link: { url: string };
  step_link: { url: string };
  step_capsule_link: { url: string };
  step_category: string;
  step_description: string;
  step_activity_description: string;
}

interface RouteStepsProps {
  steps: Step[];
}

export function RouteSteps({ steps }: RouteStepsProps) {
  return (
    <div className="w-full">
      <div className="space-y-6">
        {steps.map((step, index) => (
          <div key={index} className="relative">
            {/* Número del paso */}
            <div className="absolute top-0 -left-3 z-10">
              <div className="text-foreground flex h-8 w-8 items-center justify-center rounded-full bg-[#DAE7FB] text-sm font-semibold">
                {index + 1}
              </div>
            </div>

            {/* Descripción de actividad */}
            <div className="mb-6 ml-8">
              <p className="text-foreground text-base leading-relaxed">
                {step.step_activity_description}
              </p>
            </div>

            {/* PlaceCard */}
            <div className="ml-8">
              <PlaceCard
                title={step.step_title}
                area={step.step_area}
                mapLink={step.step_map_link}
                link={step.step_link}
                capsuleLink={step.step_capsule_link}
                category={step.step_category}
                description={step.step_description}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
