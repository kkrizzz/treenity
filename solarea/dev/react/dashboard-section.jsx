const DashboardSection = ({ title, style = {}, className, children }) => {
  return (
    <div className={className} style={style}>
      <div className="dashboard-section__title">{title}</div>
      <div className="dashboard-section__separate-line" />
      <div className="dashboard-section__content">{children}</div>
    </div>
  );
};

const StyledDashboardSection = styled(DashboardSection)`
  margin-bottom: 40px;

  & > .dashboard-section__title {
    font-weight: 600;
    font-size: 20px;
    line-height: 24px;
    color: ${(props) => props.theme.colors.main};
  }

  & > .dashboard-section__separate-line {
    margin: 16px 0;
    width: 48px;
    height: 1px;
    left: 688px;
    top: 245px;

    background: #788cbf;
    border-radius: 1px;
  }
`;

add(StyledDashboardSection);
