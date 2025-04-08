import {
  Box,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  IconButton,
} from "@mui/material";
import Button from "@components/Button";
import { QuestionType } from "../EditSurveyPage";

interface Props {
  question: QuestionType;
  handleChoiceChange: (
    questionIndex: number,
    choiceIndex: number,
    value: string
  ) => void;
  handleAddChoice: (questionIndex: number) => void;
  handleDeleteChoice: (questionIndex: number, choiceIndex: number) => void;
  questionIndex: number;
}

function MultipleChoiceAdd({
  question,
  handleChoiceChange,
  handleAddChoice,
  handleDeleteChoice,
  questionIndex,
}: Props) {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography>선택지</Typography>
      {question.choices?.map((choice, choiceIndex) => (
        <Box
          key={choiceIndex}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 1,
          }}
        >
          <FormControlLabel
            control={<Checkbox disabled />}
            label={
              <TextField
                fullWidth
                value={choice.text}
                onChange={(event) =>
                  handleChoiceChange(
                    questionIndex,
                    choiceIndex,
                    event.target.value
                  )
                }
                placeholder="선택지 내용을 입력하세요"
              />
            }
          />

          <IconButton
            onClick={() => handleDeleteChoice(questionIndex, choiceIndex)}
          >
            X
          </IconButton>
        </Box>
      ))}
      <Button
        text="선택지 추가"
        variant="outlined"
        onClick={() => handleAddChoice(questionIndex)}
      />
    </Box>
  );
}

export default MultipleChoiceAdd;
