import type { QuestionWithOptions, UpdateQuestionPayload } from "@/models/quiz.interface"

export function createEmptyQuestion(): QuestionWithOptions {
  return {
    question_text: "",
    question_type: "SINGLE_CHOICE",
    score: 1,
    options: Array.from({ length: 4 }, () => ({
      option_text: "",
      is_correct: false,
    })),
  }
}

export function validateQuestion(question: QuestionWithOptions, label = "Question") {
  if (!question.question_text.trim()) return `${label} text is required.`
  if (question.score <= 0) return `${label} score must be greater than zero.`
  if (question.options.length < 2) return `${label} must have at least two options.`
  if (question.options.some(option => !option.option_text.trim())) {
    return `${label} has an empty option.`
  }
  const correctCount = question.options.filter(option => option.is_correct).length
  if (correctCount === 0) return `${label} must have at least one correct answer.`
  if (question.question_type === "SINGLE_CHOICE" && correctCount !== 1) {
    return `${label} must have exactly one correct answer.`
  }
  return ""
}

export function toUpdateQuestionPayload(question: QuestionWithOptions): UpdateQuestionPayload {
  return {
    quiz_id: question.quiz_id,
    question_text: question.question_text.trim(),
    question_type: question.question_type,
    score: question.score,
    options: question.options.map(option => ({
      id: option.id,
      question_id: option.question_id,
      option_text: option.option_text.trim(),
      is_correct: option.is_correct,
    })),
  }
}

export function toNewQuestionPayload(question: QuestionWithOptions): QuestionWithOptions {
  return {
    question_text: question.question_text.trim(),
    question_type: question.question_type,
    score: question.score,
    options: question.options.map(option => ({
      option_text: option.option_text.trim(),
      is_correct: option.is_correct,
    })),
  }
}
