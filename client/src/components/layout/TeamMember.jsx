import React from 'react';
import Avatar from './Avatar';

export const TeamMember = ({ member }) => {
  const { name, role, avatar, status } = member;

  return (
    <div className="flex items-center justify-between p-2.5 rounded-xl bg-card/40 border border-border/40 hover:bg-cardHover/60 transition-colors">
      <div className="flex items-center gap-3 overflow-hidden">
        <Avatar src={avatar} name={name} status={status} size="sm" />
        <div className="flex flex-col truncate">
          <span className="text-xs font-semibold text-text-primary truncate">
            {name}
          </span>
          <span className="text-[10px] text-text-muted truncate">
            {role}
          </span>
        </div>
      </div>

      <span
        className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
          status === 'Online'
            ? 'bg-success/10 text-success border-success/30'
            : status === 'Busy'
            ? 'bg-danger/10 text-danger border-danger/30'
            : status === 'Away'
            ? 'bg-warning/10 text-warning border-warning/30'
            : 'bg-text-muted/10 text-text-muted border-border'
        }`}
      >
        {status}
      </span>
    </div>
  );
};

export default TeamMember;