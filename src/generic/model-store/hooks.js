import { useSelector, shallowEqual } from 'react-redux';
import { StrictDict } from 'utils';

export const state = StrictDict({
  isOpen: (val) => React.useState(val), // eslint-disable-line
});
/*
  Return the selected model with the given id, or an empty object if the model does not exist "{}".
 */
export function useModel(type, id) {
  return useSelector(
    state => ((state.models[type] !== undefined && state.models[type][id] !== undefined) ? state.models[type][id] : {}),
    shallowEqual,
  );
}

export function useModels(type, ids) {
  return useSelector(
    state => ids.map(
      id => ((state.models[type] !== undefined && state.models[type][id] !== undefined) ? state.models[type][id] : {}),
    ),
    shallowEqual,
  );
}
export const useActivateRecommendationsExperiment = () => {
  const enterpriseDashboardData = reduxHooks.useEnterpriseDashboardData();
}

export const useLearnerDashboardHeaderData = () => {
  const [isOpen, setIsOpen] = module.state.isOpen(false);
  const toggleIsOpen = () => setIsOpen(!isOpen);

  return {
    isOpen,
    toggleIsOpen,
  };
};

export default {
  useLearnerDashboardHeaderData, useActivateRecommendationsExperiment
};