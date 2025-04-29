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
import PageHeader from "@components/PageHeader/PageHeader";
import apiClient from "@apis/apiClient";

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

const MessageTemplatePage = () => {
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
      console.error("모든 필드를 입력해주세요.");
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
      }
    } catch (error) {
      console.error("Error creating template:", error);
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
      console.error("모든 필드를 입력해주세요.");
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
      }
    } catch (error) {
      console.error("Error updating template:", error);
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

  return (
    <Box
      sx={{
        p: 0,
        pb: 3,
        minHeight: "100vh",
        backgroundColor: "#F8F9FA",
      }}
    >
      <PageHeader title="문자 템플릿" userName="사용자 이름" />

      <Box sx={{ p: 3, display: "flex", gap: 2 }}>
        {/* 왼쪽 영역: 템플릿 목록 */}
        <Box
          sx={{
            width: "300px",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Paper
            sx={{
              p: 3,
              borderRadius: "12px",
              boxShadow: "none",
              border: "1px solid #E0E0E0",
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
              borderRadius: "12px",
              boxShadow: "none",
              border: "1px solid #E0E0E0",
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, color: "#333333" }}>
              변수 목록
            </Typography>
            <List sx={{ py: 0 }}>
              {["이름", "생년월일", "관심지역"].map((variable) => (
                <ListItem
                  key={variable}
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
                    const cursorPosition =
                      document.querySelector<HTMLTextAreaElement>("textarea")
                        ?.selectionStart || 0;
                    const newContent =
                      templateContent.slice(0, cursorPosition) +
                      `[${variable}]` +
                      templateContent.slice(cursorPosition);
                    setTemplateContent(newContent);
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
                            {variable}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: "#666666",
                              ml: 1,
                            }}
                          >
                            [{variable}]
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
          </Paper>
        </Box>

        {/* 오른쪽 영역: 템플릿 작성 */}
        <Paper
          sx={{
            flex: 1,
            p: 3,
            borderRadius: "12px",
            boxShadow: "none",
            border: "1px solid #E0E0E0",
          }}
        >
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
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
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}
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
                !selectedCategory
              }
              sx={{
                backgroundColor: "#164F9E",
                "&:hover": {
                  backgroundColor: "#0D3B7A",
                },
                "&.Mui-disabled": {
                  backgroundColor: "rgba(22, 79, 158, 0.4)",
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
