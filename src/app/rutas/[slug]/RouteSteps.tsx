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
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Pasos de la ruta
      </h2>
      
      <div className="space-y-6">
        {steps.map((step, index) => (
          <div key={index} className="relative">
            {/* Número del paso */}
            <div className="absolute -left-4 top-2 z-10">
              <div className="flex items-center justify-center w-8 h-8 bg-primary text-white rounded-full text-sm font-semibold">
                {index + 1}
              </div>
            </div>
            
            {/* Línea conectora (excepto en el último paso) */}
            {index < steps.length - 1 && (
              <div className="absolute -left-4 top-10 w-0.5 h-24 bg-gray-200 z-0" />
            )}
            
            {/* Descripción de actividad */}
            <div className="ml-8 mb-4">
              <p className="text-gray-700 text-sm leading-relaxed">
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