/*******************************************************************************
 * Copyright 2015 Fondazione Bruno Kessler
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 ******************************************************************************/
package eu.simpaticoproject.adaptation.text.controllers;

import eu.simpaticoproject.adaptation.text.Handler;
import eu.simpaticoproject.adaptation.text.tae.SimpaticoInput;
import eu.simpaticoproject.adaptation.text.tae.SimpaticoOutput;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.naming.OperationNotSupportedException;
import javax.servlet.http.HttpServletRequest;

/**
 * @author raman
 */
@Controller
public class TAEController {

    @Autowired
    private Handler handler;

    @RequestMapping(value = "/tae/simp", method = RequestMethod.GET, produces = "application/json")
    @ApiOperation(value = "Process text",
            response = SimpaticoOutput.class,
            notes = "Obtain annotations and simplifications. Two modalities supported: word simplification and sentence/paragraph simplification.")
    public @ResponseBody String simp(
            @ApiParam(value = "word to be simplified, if any", required = false) @RequestParam(required = false) String word,
            @ApiParam(value = "word position in the context, in case of word simplification", required = false) @RequestParam(required = false, defaultValue = "0") Integer position,
            @ApiParam(value = "language, as 2-letter ISO code. If not specified, derived by the tool", required = false) @RequestParam(required = false) String lang,
            @ApiParam(value = "sentext or text to be simplified in case of syntactic simplification. Word context in case of word simplification", required = false) @RequestParam(required = false) String text)
            throws Exception {
        if (text == null) {
            text = word;
        }
        String json = handler.service(word, position, lang, text);
        return json;
    }

    @RequestMapping(value = "/tae/simp", method = RequestMethod.POST, produces = "application/json")
    @ApiOperation(value = "Process text",
            response = SimpaticoOutput.class,
            notes = "Obtain text annotations and simplifications")
    public @ResponseBody String simp(@RequestBody SimpaticoInput input) throws Exception {
        if (input.getText() == null) {
            input.setText(input.getWord());
        }
        String json = handler.service(input.getWord(), input.getPosition(), input.getLang(), input.getText());
        return json;
    }

    // Request for the web demo
    @RequestMapping(value = "/tae/simpform", method = RequestMethod.POST, produces = "application/json", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    @ApiOperation(value = "Process text",
            response = SimpaticoOutput.class,
            notes = "Obtain text annotations and simplifications, used for the web demo")
    public @ResponseBody String simpform(
            @ApiParam(value = "word to be simplified, if any", required = false) @RequestParam(required = false) String word,
            @ApiParam(value = "word position in the context, in case of word simplification", required = false) @RequestParam(required = false) Integer position,
            @ApiParam(value = "language, as 2-letter ISO code. If not specified, derived by the tool", required = false) @RequestParam(required = false) String lang,
            @ApiParam(value = "text to be simplified in case of syntactic simplification. Word context in case of word simplification", required = false)
            @RequestParam(required = false) String text) throws Exception {
        String json = handler.service(word, position, lang, text);
        return json;
    }

    @RequestMapping(value = "/tae/syntsimp", method = RequestMethod.POST, produces = "application/json", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    @ApiOperation(value = "Process text",
            response = SimpaticoOutput.class,
            notes = "Perform syntactic simplification")
    public @ResponseBody String syntsimp(
            @ApiParam(value = "set to true to use the complexity checker", required = false) @RequestParam(required = false) String comp,
            @ApiParam(value = "set to true to use the confidence model", required = false) @RequestParam(required = false) String conf,
            @ApiParam(value = "language, as 2-letter ISO code. If not specified, derived by the tool", required = false) @RequestParam(required = false) String lang,
            @ApiParam(value = "text to be simplified", required = false) @RequestParam(required = false) String text) throws Exception {
        String json = handler.syntsimp(text, lang, comp, conf);
        return json;
    }

    @ExceptionHandler(OperationNotSupportedException.class)
    @ResponseStatus(HttpStatus.NOT_IMPLEMENTED)
    @ResponseBody
    public String handleNotSupportedError(HttpServletRequest request, Exception exception) {
        exception.printStackTrace();
        return "{\"error\":\"" + exception.getMessage() + "\"}";
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ResponseBody
    public String handleError(HttpServletRequest request, Exception exception) {
        exception.printStackTrace();
        return "{\"error\":\"" + exception.getMessage() + "\"}";
    }

}
