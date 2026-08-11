export const MARKDOWN_COMPONENTS = {
  h1: (props) => <h1 className="text-left text-[32px] lg:text-[36px] font-medium text-heading dark:text-heading-dark my-5 lg:my-8" {...props} />,
  h2: (props) => <h2 className="text-left text-xl lg:text-2xl font-medium text-heading dark:text-heading-dark leading-[118%] tracking-[-0.24px] mb-2" {...props} />,
  h3: (props) => <h3 className="text-left text-lg font-medium text-heading dark:text-heading-dark mb-2" {...props} />,
  pre: (props) => <pre className="bg-code dark:bg-code-dark px-4 py-3 rounded-lg overflow-x-auto" {...props} />,
};
