import { FiArrowRight, FiAward, FiBookOpen, FiCheckCircle, FiCpu, FiLayers, FiTarget, FiVideo } from 'react-icons/fi';
import Layout from '../components/Layout';
import { ProgressBar, SectionHeading, SurfaceCard } from '../components/UiPrimitives';

const paths = [
  {
    title: 'RPA Developer Path',
    summary: 'Build enterprise-grade bots with robust exception handling and workflow observability.',
    focus: ['UiPath', 'Power Automate', 'Automation Anywhere', 'Blue Prism'],
    progress: 48,
  },
  {
    title: 'AI Automation Engineer',
    summary: 'Design AI-first automation systems that combine LLM workflows with process orchestration.',
    focus: ['OpenAI APIs', 'LangChain', 'AI Workflows', 'Enterprise AI Systems'],
    progress: 36,
  },
  {
    title: 'Agentic AI Specialist',
    summary: 'Create autonomous multi-agent systems with guardrails, memory, and strategic tool use.',
    focus: ['AI Agents', 'Prompt Engineering', 'Autonomous Agents'],
    progress: 28,
  },
  {
    title: 'Automation Architect',
    summary: 'Lead end-to-end automation programs across functions, platforms, and transformation initiatives.',
    focus: ['Workflow Orchestration', 'Enterprise Automation', 'Digital Transformation'],
    progress: 54,
  },
  {
    title: 'Process Optimization Expert',
    summary: 'Use process mining and intelligent workflow diagnostics to continuously improve operations.',
    focus: ['Process Mining', 'Intelligent Workflows', 'IDP'],
    progress: 40,
  },
  {
    title: 'AI Workflow Engineer',
    summary: 'Operationalize production-grade AI workflows with reliability, traceability, and feedback loops.',
    focus: ['AI Automation', 'Workflow Automation', 'Python Automation'],
    progress: 33,
  },
];

const stack = [
  { icon: FiBookOpen, title: 'Courses', detail: 'Structured domain modules with guided projects and practical scenarios.' },
  { icon: FiTarget, title: 'Assignments', detail: 'Hands-on exercises around automation debugging and workflow design.' },
  { icon: FiCpu, title: 'Projects', detail: 'Build deployable AI + RPA solutions that mirror internal enterprise use cases.' },
  { icon: FiAward, title: 'Certifications', detail: 'Completion credentials with verifiable IDs tied to actual progress.' },
  { icon: FiVideo, title: 'Expert Sessions', detail: 'Mentor-led live sessions with chat, Q&A, and recordings.' },
  { icon: FiCheckCircle, title: 'Skill Assessments', detail: 'Scenario-based evaluations for workflow logic and AI decisioning.' },
];

function CareerPaths() {
  return (
    <Layout
      title="AI & Automation Career Paths"
      subtitle="Specialized growth tracks built for Tecnoprism's internal AI-first transformation culture."
    >
      <div className="space-y-5">
        <SurfaceCard className="rounded-2xl p-5">
          <SectionHeading
            title="Path Framework"
            subtitle="Every path combines courses, projects, certifications, expert sessions, and measurable skill checkpoints."
          />
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {stack.map((item) => (
              <div key={item.title} className="rounded-xl border border-indigo-100/70 p-4 dark:border-slate-700">
                <item.icon className="text-indigo-500" />
                <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">{item.title}</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{item.detail}</p>
              </div>
            ))}
          </div>
        </SurfaceCard>

        <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {paths.map((path) => (
            <SurfaceCard key={path.title} className="rounded-2xl p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{path.title}</h3>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{path.summary}</p>
                </div>
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-slate-800 dark:text-indigo-300">
                  {path.progress}% complete
                </span>
              </div>

              <div className="mt-4">
                <ProgressBar value={path.progress} color="from-indigo-500 to-purple-600" />
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {path.focus.map((item) => (
                  <span
                    key={`${path.title}-${item}`}
                    className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                  >
                    {item}
                  </span>
                ))}
              </div>

              <button
                type="button"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-3 py-2 text-sm font-semibold text-white"
              >
                Explore path <FiArrowRight />
              </button>
            </SurfaceCard>
          ))}
        </section>

        <SurfaceCard className="rounded-2xl p-5">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-300">
            <FiLayers />
            <p className="text-sm font-semibold">Internal Innovation Culture</p>
          </div>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            These paths are designed to encourage AI experimentation, automation thinking, cross-team collaboration,
            and continuous knowledge sharing across Tecnoprism.
          </p>
        </SurfaceCard>
      </div>
    </Layout>
  );
}

export default CareerPaths;
