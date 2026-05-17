import { useState, useCallback, useRef } from "react";

interface AISuggestionState {
  suggestion: string | null;
  isLoading: boolean;
  position: { line: number; column: number } | null;
  decoration: string[];
  isEnabled: boolean;
}

interface UseAISuggestionReturn extends AISuggestionState {
  toggleEnabled: () => void;
  fetchSuggestion: (type: string, editor: any) => Promise<void>;
  acceptSuggestion: (editor: any, monaco: any) => void;
  rejectSuggestion: (editor: any) => void;
  clearSuggestion: (editor: any) => void;
}

export const useAISuggestions = (): UseAISuggestionReturn => {
  const [state, setState] = useState<AISuggestionState>({
    suggestion: null,
    isLoading: false,
    position: null,
    decoration: [],
    isEnabled: true,
  });

  // Keep a stable mutable reference to the latest state values to avoid dependency array invalidations
  const stateRef = useRef(state);
  stateRef.current = state;

  // Use a ref to cancel obsolete pending requests on subsequent keystrokes
  const abortControllerRef = useRef<AbortController | null>(null);

  const toggleEnabled = useCallback(() => {
    setState((prev) => ({ ...prev, isEnabled: !prev.isEnabled }));
  }, []);

  const fetchSuggestion = useCallback(async (type: string, editor: any) => {
    // Read from the ref to always have the absolute latest enablement state
    if (!stateRef.current.isEnabled || !editor) return;

    const model = editor.getModel();
    const cursorPosition = editor.getPosition();

    if (!model || !cursorPosition) return;

    // Abort previous running fetch call if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      const payload = {
        fileContent: model.getValue(),
        cursorLine: cursorPosition.lineNumber - 1,
        cursorColumn: cursorPosition.column - 1,
        suggestionType: type,
      };

      const response = await fetch("/api/code-completion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`API responded with status ${response.status}`);
      }

      const data = await response.json();

      if (data.suggestion) {
        const suggestionText = data.suggestion.trim();
        setState((prev) => ({
          ...prev,
          suggestion: suggestionText,
          position: {
            line: cursorPosition.lineNumber,
            column: cursorPosition.column,
          },
          isLoading: false,
        }));
      } else {
        console.warn("No suggestion received from API.");
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    } catch (error: any) {
      if (error.name === "AbortError") {
        console.log("Previous request aborted.");
        return;
      }
      console.error("Error fetching code suggestion:", error);
      setState((prev) => ({ ...prev, isLoading: false }));
    } finally {
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
    }
  }, []); // Empty dependency array means this function reference remains absolutely stable

  const acceptSuggestion = useCallback((editor: any, monaco: any) => {
    if (!editor || !monaco) return;

    // Read values directly out of current state snapshot snapshot ref
    const { suggestion, position, decoration } = stateRef.current;
    if (!suggestion || !position) return;

    const { line, column } = position;
    const sanitizedSuggestion = suggestion.replace(/^\d+:\s*/gm, "");

    // 1. Run Monaco Editor Side effects out of React's state tree loops
    editor.executeEdits("", [
      {
        range: new monaco.Range(line, column, line, column),
        text: sanitizedSuggestion,
        forceMoveMarkers: true,
      },
    ]);

    if (decoration.length > 0) {
      editor.deltaDecorations(decoration, []);
    }

    // 2. Clear state properties cleanly
    setState((prev) => ({
      ...prev,
      suggestion: null,
      position: null,
      decoration: [],
    }));
  }, []);

  const rejectSuggestion = useCallback((editor: any) => {
    const { decoration } = stateRef.current;

    if (editor && decoration.length > 0) {
      editor.deltaDecorations(decoration, []);
    }

    setState((prev) => ({
      ...prev,
      suggestion: null,
      position: null,
      decoration: [],
    }));
  }, []);

  const clearSuggestion = useCallback((editor: any) => {
    const { decoration } = stateRef.current;

    if (editor && decoration.length > 0) {
      editor.deltaDecorations(decoration, []);
    }

    setState((prev) => ({
      ...prev,
      suggestion: null,
      position: null,
      decoration: [],
    }));
  }, []);

  return {
    ...state,
    toggleEnabled,
    fetchSuggestion,
    acceptSuggestion,
    rejectSuggestion,
    clearSuggestion,
  };
};
