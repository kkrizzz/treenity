import React from 'react';
import { useAccount } from '../hooks/useAccount';
import { useLoadAccountComponent } from '../hooks/useLoadComponent';
import { Icon } from '../components/Icon';
import { toast } from '../utils/toast';
import { useEditorGridLayout } from '../editor/NewEditor/useEditorGridLayout';
import { useGraphQL } from '../hooks/useGraphQL';

interface RenderProps {
  id: string;
  name?: string;
  context?: string;
  children?: any;

  [more: string]: any;
}

function ComponentWrapper({ id, name, context, children, props, more }) {
  const [, , addGridComponent] = useEditorGridLayout('default~react~default');

  const saveTo = () => {
    addGridComponent(id, name, context, { ...props, ...more });
    toast('Added to grid "default"');
  };

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ top: 0, right: 0, zIndex: 100, position: 'absolute' }} onClick={saveTo}>
        <Icon name="play" />
      </div>
      {children}
    </div>
  );
}

function Render(props: RenderProps) {
  const {
    id,
    name = 'default',
    context = 'react',
    children,
    fallback,
    render,
    loading,
    loaderHook,
    ...more
  } = props;
  const [componentInfo, isLoading] = loaderHook
    ? loaderHook(props)
    : useLoadAccountComponent(id, name, context);

  // console.log('rendering', id, name, context, isLoading);
  if (isLoading) {
    return loading ? loading(props) : <span className="spinner-grow spinner-grow-sm m-r-4" />;
  }

  if (!componentInfo) {
    if (fallback !== undefined) return fallback(props);
    return 'not found';
  }

  let result: JSX.Element | null = null;
  try {
    const { component: Component, props, needAccount, viewData } = componentInfo;

    const queriesData = {};
    viewData.queries?.forEach((q) => {
      let [data, isLoading] = useGraphQL(q.endpointURL, q.query, { variables: q.variables });
      queriesData[q.name] = {
        data: data?.data,
        isLoading,
      };
    });

    if (more.addable === true) {
      result = (
        <ComponentWrapper id={id} context={context} name={name} props={props} more={more}>
          <Component
            {...more}
            {...props}
            {...queriesData}
            id={id}
            context={context}
            name={name}
            children={children}
          />
        </ComponentWrapper>
      );
    } else if (needAccount) {
      const [accountInfo, isAccLoading] = useAccount(id);
      if (isAccLoading) {
        return <span className="spinner-grow spinner-grow-sm m-r-4"></span>;
      }
      result = (
        <Component
          {...more}
          {...props}
          {...queriesData}
          id={id}
          value={accountInfo}
          context={context}
          name={name}
          children={children}
        />
      );
    } else {
      result = (
        <Component
          {...more}
          {...props}
          {...queriesData}
          id={id}
          context={context}
          name={name}
          children={children}
        />
      );
    }
  } catch (e) {
    console.error('Render', id, context, name, e);
  }

  if (render) return render(result, props);

  return result;
}

export const render = (id: string, name: string, context: string, defProps) => (props) =>
  Render({ id, name, context, ...defProps, ...props });

export default Render;
