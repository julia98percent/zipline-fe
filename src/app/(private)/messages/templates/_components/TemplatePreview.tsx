import React from "react";
import { Typography } from "@mui/material";
import { AllowedVariable } from "@/types/message";

interface TemplatePreviewProps {
  templateContent: string;
  allowedVariables: readonly AllowedVariable[];
  hasBrokenVariable: boolean;
}

const TemplatePreview: React.FC<TemplatePreviewProps> = ({
  templateContent,
  allowedVariables,
  hasBrokenVariable,
}) => {
  const getHighlightedPreview = (
    content: string,
    allowedVariables: readonly AllowedVariable[]
  ): React.ReactNode[] => {
    const regex = /({{[^}]*}}|{{[^}]*|[^{{}]*}})/g;
    let lastIndex = 0;
    const result: React.ReactNode[] = [];
    let match;

    while ((match = regex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        const text = content.slice(lastIndex, match.index);
        result.push(
          <span key={lastIndex}>
            {text.split("\n").map((line, index, array) => (
              <React.Fragment key={index}>
                {line}
                {index < array.length - 1 && <br />}
              </React.Fragment>
            ))}
          </span>
        );
      }

      const part = match[0];

      // 정상 변수
      if (part.startsWith("{{") && part.endsWith("}}") && part.length > 4) {
        const variableName = part.slice(2, -2).trim() as AllowedVariable;
        if (allowedVariables.includes(variableName)) {
          result.push(
            <span
              key={match.index}
              style={{
                display: "inline-block",
                background: "var(--color-primary-hover)",
                color: "var(--color-primary)",
                borderRadius: "8px",
                padding: "2px 8px",
                margin: "0 2px",
                fontWeight: 600,
                fontSize: "0.95em",
                verticalAlign: "middle",
              }}
            >
              {variableName}
            </span>
          );
          lastIndex = regex.lastIndex;
          continue;
        }
      }

      // 깨진 변수: {{허용된변수명 으로 시작하지만 }}로 안 끝남
      if (part.startsWith("{{") && !part.endsWith("}}")) {
        const brokenVar = part.slice(2).trim();
        if (allowedVariables.some((v) => brokenVar.startsWith(v))) {
          result.push(
            <span key={match.index} style={{ color: "red", fontWeight: 600 }}>
              {part}
            </span>
          );
          lastIndex = regex.lastIndex;
          continue;
        }
      }

      // 나머지는 일반 텍스트
      result.push(
        <span key={match.index}>
          {part.split("\n").map((line, index, array) => (
            <React.Fragment key={index}>
              {line}
              {index < array.length - 1 && <br />}
            </React.Fragment>
          ))}
        </span>
      );
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < content.length) {
      const text = content.slice(lastIndex);
      result.push(
        <span key={lastIndex}>
          {text.split("\n").map((line, index, array) => (
            <React.Fragment key={index}>
              {line}
              {index < array.length - 1 && <br />}
            </React.Fragment>
          ))}
        </span>
      );
    }

    return result;
  };

  return (
    <div className="mt-4">
      <span className="text-sm font-normal text-neutral-600">미리보기</span>
      <div className="mt-1 p-7 bg-neutral-100 rounded-lg min-h-[48px] max-h-[200px] text-base overflow-y-auto">
        {getHighlightedPreview(templateContent, allowedVariables)}
      </div>
      {hasBrokenVariable && (
        <Typography color="error" className="mt-2">
          변수 표기(&#123;&#123;...&#125;&#125;)가 올바르지 않습니다. 쌍이
          맞는지 확인해 주세요.
        </Typography>
      )}
    </div>
  );
};

export default TemplatePreview;
