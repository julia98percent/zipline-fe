import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Select,
  MenuItem,
} from "@mui/material";
import { toast } from "react-toastify";
import PageHeader from "@components/PageHeader/PageHeader";
import apiClient from "@apis/apiClient";
import useUserStore from "@stores/useUserStore";
import { showToast } from "@components/Toast/Toast";
interface Template {
  uid: number;
  name: string;
  category: "GENERAL" | "BIRTHDAY" | "EXPIRED_NOTI";
  content: string;
}

interface TemplateCategory {
  id: number;
  name: string;
  category: Template["category"];
  templates: Template[];
}

interface TemplateResponse {
  success: boolean;
  code: number;
  message: string;
  data: Template[];
}

const ALLOWED_VARIABLES = ["이름", "생년월일", "관심지역"] as const;
type AllowedVariable = (typeof ALLOWED_VARIABLES)[number];

const MessageTemplatePage = () => {
  const { user } = useUserStore();
  const [templateTitle, setTemplateTitle] = useState("");
  const [templateContent, setTemplateContent] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [templateList, setTemplateList] = useState<TemplateCategory[]>([
    { id: 1, name: "일반", category: "GENERAL", templates: [] },
    { id: 2, name: "생일", category: "BIRTHDAY", templates: [] },
    { id: 3, name: "계약 만료", category: "EXPIRED_NOTI", templates: [] },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  // 변수 목록 정의
  const VARIABLE_LIST = ALLOWED_VARIABLES.map((key) => ({ label: key, key }));

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    setTemplateTitle(template.name);
    setTemplateContent(template.content);
    setSelectedCategory(template.category);
  };

  const handleAddNewTemplate = () => {
    setSelectedTemplate(null);
    setTemplateTitle("");
    setTemplateContent("");
    setSelectedCategory("");
  };

  const handleCreateTemplate = async () => {
    if (!templateTitle || !templateContent || !selectedCategory) {
      showToast({
        message: "모든 필드를 입력해주세요.",
        type: "error",
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await apiClient.post("/templates", {
        name: templateTitle,
        content: templateContent,
        category: selectedCategory,
      });

      if (response.data.success) {
        fetchTemplates();
        handleAddNewTemplate(); // Reset form
        showToast({
          message: "템플릿을 생성했습니다.",
          type: "success",
        });
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      showToast({
        message:
          err?.response?.data?.message ||
          "템플릿 생성 중 오류가 발생했습니다. 다시 시도해주세요.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTemplate = async () => {
    if (
      !selectedTemplate ||
      !templateTitle ||
      !templateContent ||
      !selectedCategory
    ) {
      showToast({
        message: "모든 필드를 입력해주세요.",
        type: "error",
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await apiClient.patch(
        `/templates/${selectedTemplate.uid}`,
        {
          name: templateTitle,
          content: templateContent,
          category: selectedCategory,
        }
      );

      if (response.data.success) {
        fetchTemplates();
        showToast({
          message: "템플릿을 수정했습니다.",
          type: "success",
        });
      }
    } catch (error) {
      console.error("Error updating template:", error);
      showToast({
        message: "템플릿 수정 중 오류가 발생했습니다. 다시 시도해주세요.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Move fetchTemplates outside useEffect so it can be reused
  const fetchTemplates = async () => {
    try {
      setIsLoading(true);
      const { data: response } = await apiClient.get<TemplateResponse>(
        "/templates"
      );

      if (response.success && response.code === 200 && response.data) {
        const updatedTemplateList = templateList.map((category) => ({
          ...category,
          templates: response.data.filter(
            (template) => template.category === category.category
          ),
        }));
        setTemplateList(updatedTemplateList);
      } else {
        console.error("Failed to fetch templates:", response.message);
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  // 깨진 변수 검사: 허용된 변수명으로 시작하지만 }}로 끝나지 않는 경우가 있으면 true
  const hasBrokenVariable = (() => {
    const regex = /({{[^}]*}}|{{[^}]*|[^{{}]*}})/g;
    let match;
    while ((match = regex.exec(templateContent)) !== null) {
      const part = match[0];
      if (part.startsWith("{{") && !part.endsWith("}}")) {
        const extractedVar = part.slice(2).trim();
        if (ALLOWED_VARIABLES.some((v) => extractedVar.startsWith(v))) {
          return true;
        }
      }
    }
    return false;
  })();

  // 미리보기에서 변수 하이라이트 및 깨진 변수 빨간색 표시
  function getHighlightedPreview(content: string) {
    const regex = /({{[^}]*}}|{{[^}]*|[^{{}]*}})/g;
    let lastIndex = 0;
    const result: React.ReactNode[] = [];
    let match;
    while ((match = regex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        result.push(
          <span key={lastIndex}>{content.slice(lastIndex, match.index)}</span>
        );
      }
      const part = match[0];
      // 정상 변수
      if (part.startsWith("{{") && part.endsWith("}}") && part.length > 4) {
        const variableName = part.slice(2, -2).trim() as AllowedVariable;
        if (ALLOWED_VARIABLES.includes(variableName)) {
          result.push(
            <span
              key={match.index}
              style={{
                display: "inline-block",
                background: "#E3F2FD",
                color: "#164F9E",
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
        if (ALLOWED_VARIABLES.some((v) => brokenVar.startsWith(v))) {
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
      result.push(<span key={match.index}>{part}</span>);
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < content.length) {
      result.push(<span key={lastIndex}>{content.slice(lastIndex)}</span>);
    }
    return result;
  }

  return (
    <Box
      sx={{
        p: 0,
        pb: 3,
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <PageHeader title="문자 템플릿" userName={user?.name || "-"} />

      <Box sx={{ p: 3, display: "flex", gap: "28px" }}>
        {/* 왼쪽 영역: 템플릿 목록 */}
        <Box
          sx={{
            width: "300px",
            display: "flex",
            flexDirection: "column",
            gap: "28px",
          }}
        >
          <Paper
            sx={{
              p: 3,
              borderRadius: "8px",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
            }}
          >
            <Typography variant="h6" sx={{ mb: 1, color: "#333333" }}>
              템플릿 목록
            </Typography>
            <List sx={{ py: 0 }}>
              {templateList.map((category) => (
                <Box key={category.id}>
                  <ListItem sx={{ px: 0, py: 0.5 }}>
                    <ListItemText
                      primary={category.name}
                      sx={{
                        "& .MuiTypography-root": {
                          fontWeight: "bold",
                          color: "#333333",
                          fontSize: "0.9rem",
                        },
                      }}
                    />
                  </ListItem>
                  {category.templates.map((template) => (
                    <ListItem
                      key={template.uid}
                      sx={{
                        pl: 2,
                        py: 0.5,
                        cursor: "pointer",
                        minHeight: "32px",
                        backgroundColor:
                          selectedTemplate?.uid === template.uid
                            ? "#F0F7FF"
                            : "transparent",
                        "&:hover": {
                          backgroundColor: "#F0F7FF",
                        },
                      }}
                      onClick={() => handleTemplateSelect(template)}
                    >
                      <ListItemText
                        primary={
                          <Typography
                            variant="body2"
                            sx={{
                              color:
                                selectedTemplate?.uid === template.uid
                                  ? "#164F9E"
                                  : "#666666",
                              "&:hover": { color: "#164F9E" },
                              fontSize: "0.875rem",
                            }}
                          >
                            • {template.name}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                  <Divider sx={{ my: 0.5 }} />
                </Box>
              ))}
            </List>
            <Button
              variant="outlined"
              fullWidth
              onClick={handleAddNewTemplate}
              sx={{
                mt: 2,
                borderColor: "#164F9E",
                color: "#164F9E",
                "&:hover": {
                  borderColor: "#0D3B7A",
                  backgroundColor: "rgba(22, 79, 158, 0.04)",
                },
              }}
            >
              템플릿 추가하기
            </Button>
          </Paper>

          {/* 변수 목록 영역 */}
          <Paper
            sx={{
              p: 3,
              borderRadius: "8px",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, color: "#333333" }}>
              변수 목록
            </Typography>
            <List sx={{ py: 0 }}>
              {VARIABLE_LIST.map((variable) => (
                <ListItem
                  key={variable.key}
                  sx={{
                    px: 1.5,
                    py: 1,
                    cursor: "pointer",
                    borderRadius: "6px",
                    transition: "all 0.2s ease",
                    mb: 0.5,
                    "&:hover": {
                      backgroundColor: "rgba(22, 79, 158, 0.04)",
                      "& .variable-insert-icon": {
                        opacity: 1,
                        transform: "translateX(0)",
                      },
                    },
                  }}
                  onClick={() => {
                    const textarea =
                      document.querySelector<HTMLTextAreaElement>("textarea");
                    const cursorPosition =
                      textarea?.selectionStart ?? templateContent.length;
                    setTemplateContent(
                      templateContent.slice(0, cursorPosition) +
                        `{{${variable.key}}}` +
                        templateContent.slice(cursorPosition)
                    );
                  }}
                >
                  <ListItemText
                    primary={
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#333333",
                              fontWeight: 500,
                            }}
                          >
                            {variable.label}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: "#666666",
                              ml: 1,
                            }}
                          >
                            {`{{${variable.key}}}`}
                          </Typography>
                        </Box>
                        <Box
                          className="variable-insert-icon"
                          sx={{
                            color: "#164F9E",
                            fontSize: "0.75rem",
                            opacity: 0,
                            transform: "translateX(-4px)",
                            transition: "all 0.2s ease",
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: 500,
                            }}
                          >
                            추가
                          </Typography>
                          <Box
                            component="span"
                            sx={{
                              width: "16px",
                              height: "16px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: "4px",
                              backgroundColor: "#164F9E",
                              color: "#FFFFFF",
                              fontSize: "12px",
                            }}
                          >
                            +
                          </Box>
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
            <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>
              변수는 반드시 <b>{"{{변수명}}"}</b> 형태로만 입력해 주세요.
              <br />
              (예: {"{{이름}}"}, {"{{생년월일}}"}, {"{{관심지역}}"})
            </Typography>
          </Paper>
        </Box>

        {/* 오른쪽 영역: 템플릿 작성 */}
        <Paper
          sx={{
            flex: 1,
            p: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
          }}
        >
          <Box sx={{ display: "flex", gap: "28px", mb: 2 }}>
            <TextField
              fullWidth
              placeholder="템플릿 제목"
              value={templateTitle}
              onChange={(e) => setTemplateTitle(e.target.value)}
              sx={{
                backgroundColor: "#FFFFFF",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#E0E0E0",
                    borderRadius: "20px",
                  },
                  "&:hover fieldset": {
                    borderColor: "#164F9E",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#164F9E",
                  },
                },
              }}
            />
            <Select
              value={selectedCategory}
              onChange={(e) =>
                setSelectedCategory(e.target.value as Template["category"])
              }
              displayEmpty
              sx={{
                minWidth: 200,
                backgroundColor: "#FFFFFF",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#E0E0E0",
                  borderRadius: "20px",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#164F9E",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#164F9E",
                },
              }}
            >
              <MenuItem value="" disabled>
                카테고리 선택
              </MenuItem>
              {templateList.map((category) => (
                <MenuItem key={category.id} value={category.category}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </Box>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="템플릿 내용을 입력하세요"
            value={templateContent}
            onChange={(e) => setTemplateContent(e.target.value)}
            sx={{
              backgroundColor: "#FFFFFF",
              "& .MuiOutlinedInput-root": {
                borderRadius: "20px",
                "& fieldset": {
                  borderColor: "#E0E0E0",
                },
                "&:hover fieldset": {
                  borderColor: "#164F9E",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#164F9E",
                },
              },
            }}
          />
          {/* 미리보기 및 깨진 변수 경고 */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" sx={{ color: "#666", mb: 0.5 }}>
              미리보기
            </Typography>
            <Box
              sx={{
                p: "28px",
                background: "#F8F9FA",
                borderRadius: 2,
                minHeight: 48,
                fontSize: 16,
              }}
            >
              {getHighlightedPreview(templateContent)}
            </Box>
            {hasBrokenVariable && (
              <Typography color="error" sx={{ mt: 1 }}>
                변수 표기(&#123;&#123;...&#125;&#125;)가 올바르지 않습니다. 쌍이
                맞는지 확인해 주세요.
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "28px",
              mt: 2,
            }}
          >
            {selectedTemplate && (
              <Button
                variant="outlined"
                onClick={handleAddNewTemplate}
                sx={{
                  borderColor: "#E0E0E0",
                  color: "#666666",
                  "&:hover": {
                    borderColor: "#999999",
                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                  },
                }}
              >
                취소
              </Button>
            )}
            <Button
              variant="contained"
              onClick={
                selectedTemplate ? handleUpdateTemplate : handleCreateTemplate
              }
              disabled={
                isLoading ||
                !templateTitle ||
                !templateContent ||
                !selectedCategory ||
                hasBrokenVariable
              }
              sx={{
                backgroundColor: "#164F9E",
                "&:hover": {
                  backgroundColor: "#0D3B7A",
                },
                "&.Mui-disabled": {
                  backgroundColor: "rgba(22, 79, 158, 0.4)",
                  color: "#fff",
                },
              }}
            >
              {selectedTemplate ? "수정하기" : "저장하기"}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default MessageTemplatePage;
