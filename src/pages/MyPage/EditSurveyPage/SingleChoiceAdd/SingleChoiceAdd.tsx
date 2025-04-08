import {
  Box,
  TextField,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
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

function SingleChoiceAdd({
  question,
  handleChoiceChange,
  handleAddChoice,
  handleDeleteChoice,
  questionIndex,
}: Props) {
  return (
    <FormControl sx={{ mt: 2 }}>
      <FormLabel>선택지</FormLabel>
      <RadioGroup>
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
              value={choice.text}
              control={<Radio disabled />}
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
      </RadioGroup>
      <Button
        text="선택지 추가"
        variant="outlined"
        onClick={() => handleAddChoice(questionIndex)}
      />
    </FormControl>
  );
}

export default SingleChoiceAdd;
